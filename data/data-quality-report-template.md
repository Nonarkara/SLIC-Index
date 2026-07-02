# SLIC Index Data Quality Report — Template
# Annual transparency report on data sources, coverage, and known issues

---

## Report Structure

This is a **public, annual report** that the SLIC Index publishes to maintain transparency and accountability. It should be linked from the methodology page and the footer of every page.

```
data-quality-report/
├── YYYY-annual-report.md          # Full narrative report
├── coverage-summary.csv           # Coverage grades for all 163 cities
├── source-inventory.json          # All 20+ data sources with metadata
├── known-issues.json              # Data gaps, errors, and planned fixes
├── metric-changelog.json          # Changes to metrics over time
└── audit-log.json                 # Changes made during the year
```

---

## 1. Annual Report Narrative Template

```markdown
# SLIC Index Data Quality Report: [Year]

## Executive Summary

The SLIC Index V3 [Year] Edition covers **163 cities** across **6 tiers** with **20 metrics** organized into **5 pillars**. This report documents the state of our data, the sources we use, the gaps we know about, and the improvements we have made since the last edition.

### Key Statistics
- **Total cities ranked:** 163
- **Coverage Grade A (75%+):** XX cities
- **Coverage Grade B (50-74%):** XX cities
- **Coverage Grade C (35-49%):** XX cities
- **Data sources used:** 20+
- **New cities added this year:** X
- **Cities removed this year:** X
- **Metrics revised this year:** X
- **Known data gaps:** XX

---

## 2. Data Source Inventory

### Primary Sources (Directly Measured)

| Source ID | Source Name | Metrics Covered | Update Frequency | License | Last Updated | Reliability |
|-----------|-------------|----------------|------------------|---------|--------------|-------------|
| numbeo | Numbeo Cost of Living | Cost of living, rent, groceries | Daily | Proprietary (scraped) | 2026-04 | Medium |
| worldbank | World Bank Open Data | GDP, population, internet | Annual | Open Data | 2025-12 | High |
| un | UN Population Division | Population, urbanization | Annual | Open Data | 2025-07 | High |
| iea | International Energy Agency | Energy consumption, emissions | Annual | Subscription | 2025-09 | High |
| world-air-quality | World Air Quality Index | Air quality (PM2.5) | Real-time | Open Data | Real-time | Medium |
| walkscore | Walk Score | Walkability | Annual | API (free tier) | 2025-08 | Medium |
| tomtom | TomTom Traffic Index | Traffic congestion | Annual | Open Data | 2025-06 | High |
| global-peace | Global Peace Index | Safety, stability | Annual | Open Data | 2025-06 | High |
| wikipedia | Wikipedia / Wikidata | City area, population | Continuous | CC-BY-SA | Real-time | Medium |
| weibo | Weibo Search Index | Social engagement | Real-time | Proprietary | Real-time | Low |
| cta | Civic Tech Atlas | Civic tech initiatives | Manual | CC-BY-SA | 2025-12 | Medium |
| asean | ASEAN Digital Masterplan | Digital infrastructure | Annual | Open Data | 2025-09 | High |
| deutsche-bank | Deutsche Bank Mapping the World | Prices, mapping | Annual | Proprietary | 2025-12 | Medium |
| waze | Waze Mobility | Traffic, commute | Real-time | Proprietary | Real-time | Medium |
| numbeo-health | Numbeo Healthcare | Healthcare quality | Annual | Proprietary | 2025-10 | Medium |
| global-footprint | Global Footprint Network | Carbon footprint | Annual | Open Data | 2025-09 | High |
| mcad | MasterCard Advisory | Digital payments | Annual | Proprietary | 2025-11 | Low |
| dotast | dotast Studio | Digital footprint | Manual | CC-BY-SA | 2025-12 | Medium |
| cafe | CAFE | Energy, cities | Annual | Open Data | 2025-08 | High |
| moc | MOC | Digital government | Annual | Open Data | 2025-10 | High |

### Composite Sources (Calculated from Multiple Sources)

| Metric | Sources Combined | Calculation Method | Reliability |
|--------|-----------------|-------------------|-------------|
| Pressure Score | Numbeo, World Bank, IEA, Global Peace Index | Weighted average with variance penalty | Medium-High |
| Viability Score | Walk Score, Numbeo, World Bank, Air Quality | Weighted average with variance penalty | Medium-High |
| Capability Score | World Bank, Numbeo, UN | Weighted average with variance penalty | High |
| Community Score | Weibo, CTA, Facebook, Wikipedia | Weighted average with variance penalty | Medium |
| Creative Score | ASEAN, MOC, dotast, Cafe, McAd, Deutsche Bank | Weighted average with variance penalty | Medium |

---

## 3. Coverage Grade Breakdown

### Coverage Grade A (75%+ data availability)
**Cities:** XX  
**Characteristics:** Major global cities with comprehensive, frequently updated data. All 5 pillars have at least 3 metrics each.  
**Examples:** Bangkok, Taipei, Singapore, Tokyo, London, New York, Seoul, Copenhagen, Sydney

### Coverage Grade B (50-74% data availability)
**Cities:** XX  
**Characteristics:** Secondary cities with good data but gaps in specific pillars. Usually missing social media metrics (Weibo, Facebook) or civic tech data.  
**Examples:** [List of B-grade cities]

### Coverage Grade C (35-49% data availability)
**Cities:** XX  
**Characteristics:** Smaller cities or cities in data-poor regions. Missing 2-3 pillars entirely or having only 1-2 metrics per pillar.  
**Examples:** [List of C-grade cities]

### Coverage Grade D (<35% data availability)
**Cities:** XX  
**Characteristics:** Cities with severe data gaps. Often newly added or in conflict zones.  
**Examples:** [List of D-grade cities]

---

## 4. Known Data Issues

### Issue #001: [City Name] — Missing [Metric Name]
- **Severity:** Medium
- **Impact:** Reduces [Pillar] score accuracy
- **Root cause:** [Source name] does not cover this city
- **Workaround:** Imputed from regional average or nearest city
- **Planned fix:** Request data from [alternative source] or add manual survey
- **ETA:** [Year] Edition

### Issue #002: [Pillar Name] — Metric [X] has conflicting sources
- **Severity:** High
- **Impact:** Score could vary by ±10% depending on source chosen
- **Root cause:** Numbeo and World Bank report different values for [metric]
- **Workaround:** Average of both sources, with variance penalty
- **Planned fix:** Primary source agreement with one provider; manual validation
- **ETA:** [Year] Edition

### Issue #003: [Region] — Systematic under-coverage
- **Severity:** High
- **Impact:** Cities in [Region] are under-ranked due to missing data
- **Root cause:** No reliable data source for [metric] in this region
- **Workaround:** Regional imputation with explicit flag
- **Planned fix:** Partnership with [regional organization] for data sharing
- **ETA:** [Year+1] Edition

---

## 5. Methodology Changes This Year

### Change #001: [Description]
- **From:** [Old method]
- **To:** [New method]
- **Reason:** [Why]
- **Impact:** [Which cities affected, by how much]
- **Backward compatibility:** [Yes/No, explanation]

### Change #002: [Description]
- **From:** [Old method]
- **To:** [New method]
- **Reason:** [Why]
- **Impact:** [Which cities affected, by how much]
- **Backward compatibility:** [Yes/No, explanation]

---

## 6. Audit Log

| Date | Action | City/Metric | From Value | To Value | Reason | Author |
|------|--------|-------------|------------|----------|--------|--------|
| 2026-04-15 | Corrected | Bangkok — Air Quality | 45 | 38 | Source update (AQI) | Data team |
| 2026-04-10 | Added | New Delhi | — | Watchlist | New city | Editorial |
| 2026-04-05 | Removed | [City] | — | — | Data source discontinued | Data team |
| 2026-03-28 | Reclassified | Singapore | Alpha | Gamma | Editorial review | Advisory board |

---

## 7. External Audit & Review

### Advisory Board Review ([Year])
- **Date:** [Date]
- **Reviewers:** [Names]
- **Scope:** [Pillars reviewed]
- **Findings:** [Summary]
- **Recommendations:** [List]
- **Status:** [Implemented / In progress / Deferred]

### Independent Statistical Review
- **Reviewer:** [Name, affiliation]
- **Method:** [What they checked]
- **Findings:** [Summary]
- **Issues raised:** [List]
- **Resolution:** [How addressed]

---

## 8. Data Requests & Partnerships

### Open Data Requests
We have requested data from the following organizations:
- [Organization] — [Status] — [Response]

### Active Partnerships
- [Organization] — [What they provide] — [Since when]

### Data Sharing
We share our data with:
- [Organization] — [What they receive] — [License]

---

## 9. User Feedback & Corrections

### Submitted Corrections ([Year])
- **Total submissions:** XX
- **Verified and implemented:** XX
- **Under review:** XX
- **Declined:** XX

### Example Corrections
| Date | User | City/Metric | Issue | Resolution | Status |
|------|------|-------------|-------|------------|--------|
| 2026-04-10 | [Name] | Bangkok — Rent | "My rent is 30% higher than listed" | Added variance note; data is average | Closed |
| 2026-04-05 | [Name] | Taipei — Transit | "Metro coverage is 80%, not 60%" | Verified with source; updated | Implemented |

---

## 10. Appendix: Full Coverage Matrix

[CSV or JSON file with 163 rows × 20+ columns showing which metrics are available for each city]

---

*End of Data Quality Report Template*
```

---

## 2. Coverage Summary CSV Template

```csv
cityId,displayName,country,pressure,viability,capability,community,creative,overall,grade,dataPoints
th-bangkok,Bangkok,Thailand,0.72,0.68,0.71,0.77,0.71,0.717,A,18
tw-taipei,Taipei,Taiwan,0.84,0.82,0.82,0.85,0.82,0.832,A,19
sg-singapore,Singapore,Singapore,0.85,0.85,0.82,0.73,0.73,0.795,C,7
jp-osaka,Osaka,Japan,0.82,0.82,0.82,0.82,0.82,0.82,A,19
```

**Columns:**
- `cityId`: Unique identifier
- `displayName`: City name
- `country`: Country code
- `pressure`, `viability`, `capability`, `community`, `creative`: Pillar scores (0-100)
- `overall`: Overall AMPI score
- `grade`: A, B, C, or D
- `dataPoints`: Number of data points available (out of 20+)

---

## 3. Source Inventory JSON Template

```json
{
  "sources": [
    {
      "id": "numbeo",
      "name": "Numbeo Cost of Living",
      "url": "https://www.numbeo.com/cost-of-living/",
      "metrics": ["cost_of_living", "rent", "groceries", "dining", "transport_cost"],
      "update_frequency": "daily",
      "license": "proprietary_scraped",
      "last_updated": "2026-04-15",
      "reliability": "medium",
      "coverage_cities": 158,
      "notes": "User-generated data; may be biased toward English-speaking expats. We use a 3-month rolling average to smooth volatility."
    },
    {
      "id": "worldbank",
      "name": "World Bank Open Data",
      "url": "https://data.worldbank.org/",
      "metrics": ["gdp_per_capita", "population", "urbanization", "internet_penetration", "energy_use"],
      "update_frequency": "annual",
      "license": "open_data",
      "last_updated": "2025-12-01",
      "reliability": "high",
      "coverage_cities": 150,
      "notes": "National-level data; city-level estimates are derived from national proportions."
    }
  ]
}
```

---

## 4. Known Issues JSON Template

```json
{
  "issues": [
    {
      "id": "issue-001",
      "severity": "high",
      "status": "open",
      "affected_cities": ["city-001", "city-002"],
      "affected_pillars": ["pressure"],
      "affected_metrics": ["rent"],
      "title": "Rent data missing for 5 cities in Southeast Asia",
      "description": "Numbeo does not have sufficient user submissions for rent in Phnom Penh, Vientiane, Yangon, Mandalay, and Naypyidaw. Current values are imputed from regional averages.",
      "root_cause": "Insufficient user-generated data in Numbeo for these cities",
      "workaround": "Regional average imputation with 15% variance penalty",
      "planned_fix": "Partner with local real estate platforms for direct data feeds",
      "eta": "2027",
      "reported_by": "internal_review",
      "reported_date": "2026-04-01"
    }
  ]
}
```

---

## 5. Integration into the Website

### Where to Publish This Report

1. **Methodology Page:**
   - Add a "Data Quality & Transparency" section
   - Link to the full PDF report
   - Show a summary table (coverage grades, source count, known issues)

2. **Footer:**
   - "Data Quality Report: [Year]" link
   - This signals transparency on every page

3. **City Scorecard Page:**
   - Add a "Data Source" section showing which sources were used for this city
   - This is currently missing and would dramatically improve trust

4. **Download Page:**
   - Add "Data Quality Report" as a downloadable PDF
   - Add "Source Inventory" as a CSV
   - Add "Coverage Matrix" as a CSV

### What to Display on the Methodology Page

**Summary Card:**
```
Data Transparency
- 163 cities ranked
- 20+ data sources
- 5,000+ data points
- Annual quality report
- [Download Full Report]
```

**Coverage Grade Chart:**
- A simple bar chart showing the distribution of A/B/C/D grades
- This visualizes the data quality landscape at a glance

**Source Count:**
- "Each city is scored using an average of XX data points"
- This number is a credibility signal

---

## 6. Maintenance Workflow

**Annual (before each edition launch):**
1. Update all source `last_updated` dates
2. Re-run coverage analysis for all 163 cities
3. Document any new known issues
4. Write the narrative report
5. Publish the PDF and update the website links

**Quarterly:**
1. Check for source updates (e.g., Numbeo, World Bank)
2. Update source inventory if new sources are added
3. Review and close any resolved issues

**Monthly:**
1. Log any user-submitted corrections in the audit log
2. Update the known issues list if new gaps are discovered
3. Review the coverage of newly added cities

---

*End of Data Quality Report Template*
