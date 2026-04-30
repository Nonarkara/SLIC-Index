/**
 * Fetch a Wikimedia Commons photo + proper attribution for every published
 * city that does not yet have an editorial entry in cityEditorial.ts.
 *
 * Strategy:
 *   1. Wikipedia REST summary API gives `originalimage.source`
 *      (a https://upload.wikimedia.org/.../File.jpg URL)
 *   2. Extract the Commons file title from that URL.
 *   3. Commons MediaWiki API gives the artist/credit from extmetadata.
 *   4. Emit a CityEditorialSeed-shaped object per city.
 *
 * Rate-limited (220ms gap between requests) per Wikimedia etiquette.
 * Skips cities that already have entries.
 */
import { readFileSync, writeFileSync } from "node:fs";

const SLEEP_MS = 220;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Some city names need a disambiguator on Wikipedia
const WIKI_TITLE_OVERRIDES = {
  "ar-cordoba": "Córdoba, Argentina",
  "es-valencia": "Valencia",
  "us-chicago": "Chicago",
  "us-new-york": "New York City",
  "uk-london": "London",
  "jp-tokyo": "Tokyo",
  "kr-incheon": "Incheon",
  "kr-jeju-city": "Jeju City",
  "tw-taichung": "Taichung",
  "il-haifa": "Haifa",
  "il-tel-aviv": "Tel Aviv",
  "br-sao-paulo": "São Paulo",
  "mx-mexico-city": "Mexico City",
  "do-santo-domingo": "Santo Domingo",
  "vu-port-vila": "Port Vila",
  "pg-port-moresby": "Port Moresby",
  "tz-dar-es-salaam": "Dar es Salaam",
  "ws-apia": "Apia",
  "ec-cuenca": "Cuenca, Ecuador",
  "us-san-juan": "San Juan, Puerto Rico",
  "pr-san-juan": "San Juan, Puerto Rico",
  "cr-san-jose": "San José, Costa Rica",
  "kw-kuwait-city": "Kuwait City",
  "pa-panama-city": "Panama City",
  "uy-montevideo": "Montevideo",
  "py-asuncion": "Asunción",
  "pe-arequipa": "Arequipa",
  "cl-valparaiso": "Valparaíso",
  "co-medellin": "Medellín",
  "co-bogota": "Bogotá",
  "ph-cebu-city": "Cebu City",
  "ph-makati": "Makati",
  "vn-da-nang": "Da Nang",
  "kh-phnom-penh": "Phnom Penh",
  "id-surabaya": "Surabaya",
  "my-kuala-lumpur": "Kuala Lumpur",
  "my-george-town": "George Town, Penang",
  "my-melaka": "Malacca City",
  "my-kuching": "Kuching",
  "mu-port-louis": "Port Louis",
  "ge-tbilisi": "Tbilisi",
  "ru-nizhny-novgorod": "Nizhny Novgorod",
  "ru-moscow": "Moscow",
  "rs-belgrade": "Belgrade",
  "rw-kigali": "Kigali",
  "ug-kampala": "Kampala",
  "ke-nairobi": "Nairobi",
  "za-cape-town": "Cape Town",
  "za-johannesburg": "Johannesburg",
  "bw-gaborone": "Gaborone",
  "na-windhoek": "Windhoek",
  "ma-casablanca": "Casablanca",
  "ma-rabat": "Rabat",
  "sn-dakar": "Dakar",
  "gh-accra": "Accra",
  "gh-kumasi": "Kumasi",
  "om-muscat": "Muscat",
  "om-salalah": "Salalah",
  "qa-doha": "Doha",
  "bh-manama": "Manama",
  "ae-dubai": "Dubai",
  "ae-abu-dhabi": "Abu Dhabi",
  "sa-riyadh": "Riyadh",
  "sa-jeddah": "Jeddah",
  "sa-khobar": "Al Khobar",
  "jo-amman": "Amman",
  "jo-aqaba": "Aqaba",
  "lk-colombo": "Colombo",
  "lk-kandy": "Kandy",
  "mv-male": "Malé",
  "bt-thimphu": "Thimphu",
  "np-kathmandu": "Kathmandu",
  "np-pokhara": "Pokhara",
  "in-bengaluru": "Bangalore",
  "in-hyderabad": "Hyderabad",
  "in-pune": "Pune",
  "pk-karachi": "Karachi",
  "pk-lahore": "Lahore",
  "pk-islamabad": "Islamabad",
  "bd-dhaka": "Dhaka",
  "bd-chattogram": "Chittagong",
  "fj-suva": "Suva",
  "tw-taichung": "Taichung",
  "eg-alexandria": "Alexandria",
  "ng-lagos": "Lagos",
  "lt-vilnius": "Vilnius",
  "lv-riga": "Riga",
  "ee-tallinn": "Tallinn",
  "se-gothenburg": "Gothenburg",
  "no-bergen": "Bergen",
  "fi-helsinki": "Helsinki",
  "ie-cork": "Cork (city)",
  "be-antwerp": "Antwerp",
  "de-munich": "Munich",
  "at-vienna": "Vienna",
  "hu-budapest": "Budapest",
  "ro-bucharest": "Bucharest",
  "hr-zagreb": "Zagreb",
  "si-ljubljana": "Ljubljana",
  "cz-brno": "Brno",
  "cz-prague": "Prague",
  "sk-bratislava": "Bratislava",
  "pl-krakow": "Kraków",
  "pl-katowice": "Katowice",
  "pl-torun": "Toruń",
  "pl-gdansk": "Gdańsk",
  "us-pittsburgh": "Pittsburgh",
  "us-minneapolis": "Minneapolis",
  "ca-ottawa": "Ottawa",
  "ca-toronto": "Toronto",
  "ca-vancouver": "Vancouver",
  "ca-montreal": "Montreal",
  "au-sydney": "Sydney",
  "au-melbourne": "Melbourne",
  "au-brisbane": "Brisbane",
  "au-adelaide": "Adelaide",
  "au-hobart": "Hobart",
  "au-perth": "Perth",
  "nz-auckland": "Auckland",
  "nz-wellington": "Wellington",
  "nz-christchurch": "Christchurch",
  "nz-dunedin": "Dunedin",
  "jp-fukuoka": "Fukuoka",
  "jp-hiroshima": "Hiroshima",
  "jp-sapporo": "Sapporo",
  "jp-kobe": "Kobe",
  "kr-busan": "Busan",
  "kr-suwon": "Suwon",
  "kr-jeju-city": "Jeju City",
  "cn-tianjin": "Tianjin",
  "cn-guangzhou": "Guangzhou",
  "cn-shenzhen": "Shenzhen",
  "cn-shanghai": "Shanghai",
  "th-bangkok": "Bangkok",
  "th-chiang-mai": "Chiang Mai",
  "id-jakarta": "Jakarta",
  "sg-singapore": "Singapore",
};

function extractCommonsFilename(originalImageUrl) {
  // https://upload.wikimedia.org/wikipedia/commons/0/02/Bangkok_Montage_2024_2.jpg
  // -> "Bangkok Montage 2024 2.jpg"
  const match = originalImageUrl.match(/\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/?]+)/);
  if (!match) return null;
  return decodeURIComponent(match[1]).replace(/_/g, " ");
}

function stripHtml(s) {
  return (s || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

async function fetchSummary(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const r = await fetch(url, { headers: { "User-Agent": "SLIC-Index/3.4 (https://nonarkara.github.io/SLIC-Index/)" } });
  if (!r.ok) return null;
  return r.json();
}

async function fetchCommonsCredit(filename) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=user|extmetadata&titles=File:${encodeURIComponent(filename.replace(/ /g, "_"))}`;
  const r = await fetch(url, { headers: { "User-Agent": "SLIC-Index/3.4 (https://nonarkara.github.io/SLIC-Index/)" } });
  if (!r.ok) return null;
  const j = await r.json();
  const pages = j?.query?.pages;
  if (!pages) return null;
  const first = Object.values(pages)[0];
  const ii = first?.imageinfo?.[0];
  if (!ii) return null;
  const meta = ii.extmetadata ?? {};
  const artist = stripHtml(meta?.Artist?.value) || ii?.user || "Wikimedia contributor";
  const license = meta?.LicenseShortName?.value || meta?.License?.value || "";
  return { artist, license };
}

async function main() {
  const data = JSON.parse(readFileSync("src/data/publishedRankingData.json", "utf8"));
  const editorialSrc = readFileSync("src/cityEditorial.ts", "utf8");

  const existing = new Set(
    [...editorialSrc.matchAll(/^\s*"([a-z0-9-]+-[a-z0-9-]+)":\s*\{/gm)].map((m) => m[1]),
  );

  const missing = data.cities.filter((c) => !existing.has(c.cityId));
  console.log(`${missing.length} cities lack editorial entries; fetching photos...`);

  const results = [];
  let i = 0;
  for (const c of missing) {
    i++;
    const title = WIKI_TITLE_OVERRIDES[c.cityId] || c.displayName;
    process.stdout.write(`[${i}/${missing.length}] ${c.cityId} (${title})... `);
    try {
      const summary = await fetchSummary(title);
      const orig = summary?.originalimage?.source;
      if (!orig) { console.log("no image"); results.push({ ...c, status: "no-image" }); continue; }
      if (!orig.includes("/commons/")) { console.log("non-commons image"); results.push({ ...c, status: "non-commons" }); continue; }
      const filename = extractCommonsFilename(orig);
      if (!filename) { console.log("filename parse fail"); results.push({ ...c, status: "parse-fail" }); continue; }

      await sleep(SLEEP_MS);
      const credit = await fetchCommonsCredit(filename);
      const artist = credit?.artist || "Wikimedia contributor";

      results.push({
        cityId: c.cityId,
        displayName: c.displayName,
        country: c.country,
        fileName: filename,
        credit: artist,
        license: credit?.license || "",
        wikipediaTitle: title,
      });
      console.log(`OK — ${filename.slice(0, 50)} (${artist.slice(0, 30)})`);
    } catch (e) {
      console.log("ERR", e.message);
      results.push({ cityId: c.cityId, status: "error", error: e.message });
    }
    await sleep(SLEEP_MS);
  }

  writeFileSync("/tmp/city-photos-fetch.json", JSON.stringify(results, null, 2));
  console.log(`\nDone. ${results.filter((r) => r.fileName).length}/${results.length} succeeded.`);
  console.log("Output: /tmp/city-photos-fetch.json");
}

main();
