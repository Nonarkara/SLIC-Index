import copy
import csv
import importlib.util
import io
import json
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("source_provenance", ROOT / "scripts/reconcile-source-provenance.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def fixture():
    detail = {"raw": 12.5, "source": "Official country series", "sourceUrl": "https://example.invalid/country/AAA", "dataLevel": "city"}
    publication = {"updatedAt": "2026-10-25T00:00:00Z", "metricCatalog": {"m": {"inputKey": "input"}}, "cities": [{"cityId": "test-city", "country": "Test Country", "metrics": {"m": detail}}]}
    row = {"city_id": "test-city", "field": "input", "value": "12.500", "source_title": detail["source"], "source_url": detail["sourceUrl"], "source_date": "2020-12-31", "notes": "year=2020; country_proxy=Test Country"}
    return publication, row


def csv_text(*rows):
    stream = io.StringIO(newline="")
    writer = csv.DictWriter(stream, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)
    return stream.getvalue()


class ProvenanceTests(unittest.TestCase):
    def test_country_register_requires_explicit_national_input_scope_and_identity(self):
        publication, row = fixture()
        detail = publication["cities"][0]["metrics"]["m"]
        country_row = dict(row, country="Test Country", source_scope="national")
        empty_city = csv_text(dict(row, city_id="other-city"))
        detail["dataLevel"] = "national"
        entries, _, _ = module.reconcile(publication, empty_city, apply=True, country_register_text=csv_text(country_row))
        self.assertEqual(entries[0]["registerFile"], "country_context.csv")
        self.assertEqual(detail["registeredSourceDate"], row["source_date"])
        for field, value in [("country", "Other Country"), ("value", "55"), ("source_scope", "city"), ("source_url", "https://example.invalid/other")]:
            altered = dict(country_row, **{field: value})
            entries, _, _ = module.reconcile(publication, empty_city, apply=True, country_register_text=csv_text(altered))
            self.assertIsNone(entries[0]["registeredSourceDate"])
        detail["dataLevel"] = "city"
        self.assertIsNone(module.reconcile(publication, empty_city, apply=True, country_register_text=csv_text(country_row))[0][0]["registeredSourceDate"])
        detail["dataLevel"] = "national"
        mismatching_city = dict(row, value="99")
        self.assertEqual(module.reconcile(publication, csv_text(mismatching_city), apply=True, country_register_text=csv_text(country_row))[0][0]["registerStatus"], "value-mismatch")

    def test_conflicting_proxy_declarations_are_rejected_without_relabelling(self):
        publication, row = fixture()
        row["notes"] = "country_proxy=Test Country; country_proxy=Other Country"
        original = copy.deepcopy(publication)
        entries, violations, corrections = module.reconcile(publication, csv_text(row), apply=True)
        self.assertEqual(entries[0]["registerStatus"], "proxy-conflict")
        self.assertTrue(violations)
        self.assertEqual(corrections, 0)
        self.assertIsNone(entries[0]["registeredSourceDate"])
        self.assertEqual(publication, original)

    def test_exact_match_corrects_metadata_only_and_is_idempotent(self):
        publication, row = fixture()
        original = copy.deepcopy(publication)
        entries, violations, corrections = module.reconcile(publication, csv_text(row), apply=True)
        self.assertEqual(corrections, 1)
        self.assertEqual(violations, [])
        detail = publication["cities"][0]["metrics"]["m"]
        self.assertEqual(detail["raw"], original["cities"][0]["metrics"]["m"]["raw"])
        self.assertEqual(detail["dataLevel"], "national")
        self.assertEqual(detail["registeredSourceDate"], row["source_date"])
        self.assertEqual(entries[0]["registerStatus"], "matched")
        self.assertEqual(module.reconcile(publication, csv_text(row), apply=True)[2], 0)

    def test_read_only_check_catches_city_labels_and_stale_dates(self):
        publication, row = fixture()
        original = copy.deepcopy(publication)
        self.assertTrue(module.reconcile(publication, csv_text(row))[1])
        self.assertEqual(publication, original)
        module.reconcile(publication, csv_text(row), apply=True)
        publication["cities"][0]["metrics"]["m"]["registeredSourceDate"] = "2025-12-31"
        self.assertTrue(module.reconcile(publication, csv_text(row))[1])

    def test_no_inferred_dates_or_relabels_for_mismatches(self):
        for field, value in [("value", "12.6"), ("source_url", "https://example.invalid/other"), ("source_title", "A different source"), ("city_id", "other-city")]:
            with self.subTest(field=field):
                publication, row = fixture()
                row[field] = value
                entries, _, corrections = module.reconcile(publication, csv_text(row), apply=True)
                self.assertEqual(corrections, 0)
                self.assertIsNone(entries[0]["registeredSourceDate"])
                self.assertNotEqual(entries[0]["registerStatus"], "matched")
        publication, row = fixture()
        entries, _, corrections = module.reconcile(publication, csv_text(row, row), apply=True)
        self.assertEqual(entries[0]["registerStatus"], "ambiguous")
        self.assertEqual(corrections, 0)

    def test_dates_are_valid_not_future_and_unknown_dates_are_removed(self):
        for invalid in ["2026-12-31", "2020-02-30", "2020", ""]:
            publication, row = fixture()
            row["source_date"] = invalid
            publication["cities"][0]["metrics"]["m"]["registeredSourceDate"] = "2010-01-01"
            entries, _, _ = module.reconcile(publication, csv_text(row), apply=True)
            self.assertIsNone(entries[0]["registeredSourceDate"])
            self.assertNotIn("registeredSourceDate", publication["cities"][0]["metrics"]["m"])

    def test_components_are_reconciled_and_modelled_inputs_are_not_relabelled(self):
        publication, row = fixture()
        detail = publication["cities"][0]["metrics"]["m"]
        detail["key"] = "input"
        detail["dataLevel"] = "derived"
        publication["metricCatalog"]["m"] = {"inputKey": None}
        publication["cities"][0]["metrics"]["m"] = {"components": [detail]}
        entries, _, corrections = module.reconcile(publication, csv_text(row), apply=True)
        self.assertEqual(entries[0]["componentKey"], "input")
        self.assertEqual(entries[0]["dataLevel"], "derived")
        self.assertEqual(corrections, 0)

    def test_csv_parser_handles_quotes_and_embedded_newlines(self):
        publication, row = fixture()
        title = 'Series, "annual"\nwith a note'
        row["source_title"] = title
        publication["cities"][0]["metrics"]["m"]["source"] = title
        self.assertEqual(module.reconcile(publication, csv_text(row), apply=True)[0][0]["registerStatus"], "matched")

    def test_generated_artifact_gate_fails_on_drift(self):
        publication, row = fixture()
        module.reconcile(publication, csv_text(row), apply=True)
        with tempfile.TemporaryDirectory(prefix="slic-evidence-test-") as directory:
            root = Path(directory)
            (root / "src/data").mkdir(parents=True)
            (root / "data/verified_sources").mkdir(parents=True)
            (root / "src/data/publishedRankingData.json").write_text(json.dumps(publication))
            (root / "data/verified_sources/city_inputs.csv").write_text(csv_text(row))
            (root / "data/verified_sources/country_context.csv").write_text("country,field,value,source_scope\n")
            command = ["python3", str(ROOT / "scripts/reconcile-source-provenance.py"), "--root", str(root)]
            self.assertEqual(subprocess.run(command, capture_output=True).returncode, 0)
            self.assertEqual(subprocess.run(command + ["--check"], capture_output=True).returncode, 0)
            (root / "src/data/evidenceSummary.json").write_text("{}")
            self.assertEqual(subprocess.run(command + ["--check"], capture_output=True).returncode, 1)


if __name__ == "__main__":
    unittest.main()
