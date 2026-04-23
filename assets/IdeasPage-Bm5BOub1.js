import{r as m,j as e}from"./index-p9_PAa_Z.js";import{S as f}from"./SiteFooter-CV4LIh-_.js";const b=[{id:"fixmystreet",title:"FixMyStreet",city:"London",country:"UK",category:"citizen-reporting",problem:"Potholes, broken lights, and fly-tipping went unreported for weeks because there was no easy way for citizens to reach the right council department. Phone lines closed at 5pm. Emails vanished.",solution:"FixMyStreet lets anyone drop a pin on a map, describe the issue, and attach a photo. The platform automatically routes the report to the correct local authority using boundary data. Councils receive structured tickets they can triage, assign, and resolve — with public status updates visible to the reporter.",impact:"Over 2 million reports filed across the UK. Average council response time dropped 30% in participating boroughs. Forked and deployed in Nigeria, Sweden, Norway, Australia, and 20+ other countries.",techStack:["Perl","Catalyst","PostgreSQL","Leaflet.js","Open311 API"],difficulty:"starter",codeSnippet:`// FixMyStreet-compatible report via the Open311 standard
// Works with any Open311-compliant city API endpoint

const submitReport = async ({ lat, lng, category, description, photoUrl }) => {
  const body = new URLSearchParams({
    api_key: "YOUR_API_KEY",
    service_code: category,        // e.g. "pothole" or "broken-light"
    lat: String(lat),
    long: String(lng),
    description,
    ...(photoUrl && { media_url: photoUrl }),
  });

  const res = await fetch(
    "https://api.yourcity.gov/open311/v2/requests.json",
    { method: "POST", body }
  );
  const data = await res.json();
  // Returns: [{ service_request_id, token, service_notice }]
  console.log("Report filed:", data[0].service_request_id);
};

// List existing reports near a location:
const getNearbyReports = async (lat, lng) => {
  const res = await fetch(
    \`https://api.yourcity.gov/open311/v2/requests.json?lat=\${lat}&long=\${lng}&radius=500\`
  );
  return res.json();
  // Returns array of { service_request_id, status, description, lat, long }
};`,repoHint:{en:"github.com/mysociety/fixmystreet — the original Perl/Catalyst codebase. Dozens of international forks exist. The Open311 standard (open311.org) means your city API is immediately compatible.",th:"github.com/mysociety/fixmystreet — โค้ด Perl/Catalyst ต้นฉบับ มี fork นานาชาติหลายสิบตัว มาตรฐาน Open311 (open311.org) ทำให้ API ของเมืองคุณเข้ากันได้ทันที",zh:"github.com/mysociety/fixmystreet — 原始 Perl/Catalyst 代码库。Open311 标准 (open311.org) 意味着你的城市 API 可以立即兼容。"},tags:["open311","citizen-reporting","maps","leaflet","municipality","open-source"],image:"photos/report-city-walkway.jpg"},{id:"decidim",title:"Decidim",city:"Barcelona",country:"Spain",category:"governance",problem:"City budgets were decided behind closed doors. Citizens had no structured way to propose, debate, or vote on how public money should be spent. Civic participation was low and dominated by the same vocal minority.",solution:"Decidim is a full participatory democracy platform. Citizens log in, propose projects, debate them in threaded discussions, and vote on budgets within a defined allocation. Councils publish results and track implementation publicly. It handles budgeting, referendums, citizen assemblies, and open city plans.",impact:"Barcelona allocated €75 million in participatory budgets through Decidim. Deployed in 90+ cities including Helsinki, Paris, and New York. Over 1 million registered users worldwide. Helsinki used it for their entire city strategy co-creation.",techStack:["Ruby on Rails","PostgreSQL","GraphQL","Sidekiq","Docker"],difficulty:"intermediate",codeSnippet:`# Deploy Decidim with Docker Compose — ready in ~10 minutes

# docker-compose.yml
version: "3"
services:
  db:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: decidim_db_password
      POSTGRES_DB: decidim_production
  app:
    image: decidim/decidim:latest
    depends_on: [db]
    environment:
      DATABASE_URL: postgres://postgres:decidim_db_password@db/decidim_production
      SECRET_KEY_BASE: your_64_char_secret_here
      DECIDIM_NAME: "My City Council"
      DECIDIM_MAILER_SENDER: noreply@yourcity.gov
    ports:
      - "3000:3000"
    command: ["bash", "-c", "rails db:create db:migrate db:seed && rails s"]

# Then query your instance via GraphQL:
# POST https://your-decidim.city.gov/api
# {
#   "query": "{ participatoryProcesses { id title { translation(locale: \\"en\\") } } }"
# }`,repoHint:{en:"github.com/decidim/decidim — 1,400+ stars, active since 2016. Full docs at docs.decidim.org. The hosted SaaS version (decidim.org) lets you trial it before self-hosting.",th:"github.com/decidim/decidim — 1,400+ ดาว ใช้งานตั้งแต่ปี 2016 เอกสารเต็มที่ docs.decidim.org เวอร์ชัน SaaS (decidim.org) ให้ทดลองก่อนโฮสต์เอง",zh:"github.com/decidim/decidim — 1,400+ 星，2016 年起持续活跃。完整文档见 docs.decidim.org。托管 SaaS 版 (decidim.org) 可在自托管前试用。"},tags:["participatory-budgeting","democracy","governance","open-source","civic-tech"],image:"photos/report-people-meeting.jpg"},{id:"onebusaway",title:"OneBusAway",city:"Seattle",country:"USA",category:"mobility",problem:"Riders standing at bus stops had no idea if the bus was two minutes away or twenty. Static timetables meant missed connections and buses abandoned mid-route with no communication to waiting passengers.",solution:"OneBusAway aggregates real-time vehicle positions from transit agencies via GTFS-Realtime feeds and serves them through a clean REST API. Cities connect their transit data once; the platform handles mobile apps, SMS queries, voice assistants, and web interfaces automatically.",impact:"Powers MTA Bus Time in New York City (2 million daily users), Tampa Bay transit, Washington DC, Atlanta, and Raleigh. The GTFS-RT standard it helped establish is now used by every major transit agency worldwide.",techStack:["Java","Spring","GTFS-RT","REST API","PostgreSQL","Android/iOS"],difficulty:"starter",codeSnippet:`// OneBusAway REST API — query stops and arrivals
// Works with any city that runs OneBusAway or publishes GTFS-RT

const OBA_BASE = "https://api.onebusaway.org/api/where";
const API_KEY = "TEST";  // public test key for Seattle data

// Find stops near a GPS coordinate
const getStopsNearMe = async (lat, lng, radiusMeters = 300) => {
  const url = new URL(\`\${OBA_BASE}/stops-for-location.json\`);
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lng);
  url.searchParams.set("radius", radiusMeters);
  url.searchParams.set("key", API_KEY);

  const data = await fetch(url).then(r => r.json());
  return data.data.list.map(stop => ({
    id: stop.id,
    name: stop.name,
    lat: stop.lat,
    lon: stop.lon,
    direction: stop.direction,
  }));
};

// Get live arrivals for a stop
const getArrivals = async (stopId) => {
  const url = \`\${OBA_BASE}/arrivals-and-departures-for-stop/\${stopId}.json?key=\${API_KEY}\`;
  const data = await fetch(url).then(r => r.json());
  return data.data.entry.arrivalsAndDepartures.map(a => ({
    route: a.routeShortName,
    headsign: a.tripHeadsign,
    scheduledArrival: new Date(a.scheduledArrivalTime),
    predictedArrival: a.predicted ? new Date(a.predictedArrivalTime) : null,
    status: a.status,
  }));
};`,repoHint:{en:"github.com/OneBusAway — the full monorepo with server, Android, and iOS clients. Seattle's live instance is at api.onebusaway.org. To connect your city, you need a GTFS feed and a GTFS-RT vehicle positions feed.",th:"github.com/OneBusAway — monorepo ที่มีเซิร์ฟเวอร์และไคลเอนต์ Android/iOS ครบชุด อินสแตนซ์ไลฟ์ของ Seattle ที่ api.onebusaway.org เมืองของคุณต้องการฟีด GTFS และฟีด GTFS-RT ตำแหน่งยานพาหนะ",zh:"github.com/OneBusAway — 包含服务端、Android 和 iOS 客户端的完整 monorepo。西雅图实时实例在 api.onebusaway.org。接入你的城市需要 GTFS 数据源和 GTFS-RT 车辆位置源。"},tags:["transit","GTFS-RT","real-time","public-transport","mobile","open-data"],image:"photos/report-city-transit.jpg"},{id:"openaq",title:"OpenAQ",city:"Global",country:"30+ countries",category:"sustainability",problem:"Air quality data existed in a hundred different formats, locked in government silos and proprietary sensors. Cities, researchers, and citizens had no unified view. Bangkok had data. It just wasn't accessible.",solution:"OpenAQ aggregates real-time PM2.5, PM10, NO₂, O₃, CO, and SO₂ readings from 8,000+ monitoring stations worldwide into a single open API. Any city can add their sensors. Any developer can query the data. Free, forever.",impact:"231 million measurements from 65 countries. Used by WHO, World Bank, and climate researchers. Powers citizen air quality apps across Southeast Asia, Africa, and Latin America. Bangkok has live data at this moment.",techStack:["Python","Node.js","PostgreSQL","REST API","AWS Lambda"],difficulty:"starter",codeSnippet:`# Query live air quality data via OpenAQ API v3
# pip install openaq requests

import requests
from datetime import datetime, timezone

def get_city_air_quality(city: str, limit: int = 5) -> list[dict]:
    """Fetch PM2.5 readings for a city from OpenAQ."""
    params = {
        "city": city,
        "parameter": "pm25",
        "limit": limit,
        "order_by": "lastUpdated",
        "sort": "desc",
    }
    resp = requests.get(
        "https://api.openaq.org/v3/locations",
        params=params,
        headers={"X-API-Key": "YOUR_OPENAQ_API_KEY"},
        timeout=10,
    )
    resp.raise_for_status()
    return [
        {
            "station": r["name"],
            "pm25": next(
                (p["latest"]["value"] for p in r.get("parameters", [])
                 if p["parameter"] == "pm25"), None
            ),
            "updated": r.get("datetimeLast", {}).get("local", "unknown"),
        }
        for r in resp.json().get("results", [])
    ]

if __name__ == "__main__":
    stations = get_city_air_quality("Bangkok")
    for s in stations:
        pm = s["pm25"]
        label = "GOOD" if pm < 12 else "MODERATE" if pm < 35 else "UNHEALTHY"
        print(f"{s['station']}: PM2.5 = {pm} ug/m3 [{label}]")`,repoHint:{en:"openaq.org/developers — free API key in 30 seconds. github.com/openaq/openaq-api for the full platform source. Also see 'breathe-free/breathe' for a ready-made city dashboard built on OpenAQ.",th:"openaq.org/developers — คีย์ API ฟรีภายใน 30 วินาที github.com/openaq/openaq-api สำหรับซอร์สแพลตฟอร์มเต็ม ดู 'breathe-free/breathe' สำหรับแดชบอร์ดเมืองสำเร็จรูปที่สร้างบน OpenAQ",zh:"openaq.org/developers — 30 秒内获取免费 API 密钥。github.com/openaq/openaq-api 获取完整平台源码。另见 'breathe-free/breathe' — 基于 OpenAQ 的现成城市仪表板。"},tags:["air-quality","PM2.5","open-data","environment","public-health","sensors"],image:"photos/slic-overlook.jpg"},{id:"abstreet",title:"A/B Street",city:"Seattle",country:"USA",category:"mobility",problem:"City planners proposed changes to traffic signals, bike lanes, and bus routes, but had no way to test the impact before spending millions on construction. Public consultations ran on gut feel and political intuition.",solution:"A/B Street is a traffic simulation built on real OpenStreetMap data. You can close a road, add a protected bike lane, retime traffic signals, or reroute a bus line — and watch in real time how vehicles, cyclists, and pedestrians respond. No GIS licence, no consultant, no budget required.",impact:"Used by city planners in Seattle, the UK's Active Travel England programme, and urban design schools worldwide. 8,000+ GitHub stars. Contributed to real road redesign decisions in London and Seattle.",techStack:["Rust","WebAssembly","OpenStreetMap","GTFS","Svelte"],difficulty:"advanced",codeSnippet:`# Install A/B Street and run Seattle simulation
# Requires Rust toolchain: https://rustup.rs

# Clone and build
git clone https://github.com/a-b-street/abstreet
cd abstreet
cargo build --release

# Download a city map (Seattle shown; 100+ cities available)
cargo run --release --bin cli -- \\
  --oneshot=import \\
  --city=us/seattle

# Run the GUI — opens in a window
cargo run --release --bin game

# Or run headless scenario tests via CLI:
cargo run --release --bin cli -- \\
  --oneshot=simulate \\
  --map=data/system/us/seattle/maps/downtown.bin \\
  --scenario=data/system/us/seattle/scenarios/downtown/weekday.bin \\
  --output=results.json

# results.json contains: trip durations, traffic counts,
# modal split (walk/bike/car/transit), congestion heatmap data`,repoHint:{en:"github.com/a-b-street/abstreet — 8,000+ stars. The web version at a-b-street.github.io runs in a browser with no install. City map data is auto-imported from OpenStreetMap.",th:"github.com/a-b-street/abstreet — 8,000+ ดาว เวอร์ชันเว็บที่ a-b-street.github.io รันในเบราว์เซอร์โดยไม่ต้องติดตั้ง ข้อมูลแผนที่เมืองนำเข้าอัตโนมัติจาก OpenStreetMap",zh:"github.com/a-b-street/abstreet — 8,000+ 星。网页版 a-b-street.github.io 无需安装即可在浏览器中运行。城市地图数据从 OpenStreetMap 自动导入。"},tags:["traffic-simulation","urban-planning","openstreetmap","rust","wasm","mobility"],image:"photos/report-city-rail.jpg"},{id:"dhis2",title:"DHIS2",city:"Oslo",country:"Norway",category:"health",problem:"Health ministries in developing countries collected data on paper, in incompatible spreadsheets, and through ad-hoc SMS systems. Disease outbreaks were invisible until they were crises. Vaccine coverage was a guess.",solution:"DHIS2 is a national health data platform that standardises collection, aggregation, and reporting from village clinic to ministry level. It runs on any server, works offline, syncs when connected, and ships with a full GIS dashboard, analytics, and alert system.",impact:"Deployed in 80+ countries covering 40% of the world's population. Powered COVID-19 surveillance in 50+ countries. Used as the national HMIS by Uganda, Kenya, Tanzania, Vietnam, Bangladesh, and dozens more. Free, forever, for any government.",techStack:["Java","Spring","PostgreSQL","React","Docker","REST API"],difficulty:"intermediate",codeSnippet:`# Deploy DHIS2 with Docker — full national health platform in minutes
# Requires Docker and Docker Compose

# docker-compose.yml
version: "3.8"
services:
  db:
    image: postgis/postgis:13-3.1-alpine
    environment:
      POSTGRES_USER: dhis
      POSTGRES_DB: dhis2
      POSTGRES_PASSWORD: dhis_password
  web:
    image: dhis2/core:2.40
    depends_on: [db]
    environment:
      JAVA_OPTS: "-Xmx2g"
    volumes:
      - ./dhis.conf:/opt/dhis2/dhis.conf
    ports:
      - "8080:8080"

# dhis.conf
# connection.url = jdbc:postgresql://db/dhis2
# connection.username = dhis
# connection.password = dhis_password

# After startup, query via REST API:
# GET /api/dataElements?fields=id,name&pageSize=5
# Authorization: Basic admin:district

curl -u admin:district \\
  "http://localhost:8080/api/analytics.json?dimension=dx:fbfJHSPpUQD&dimension=pe:LAST_12_MONTHS&dimension=ou:LEVEL-2"
# Returns: aggregated ANC visits by district, last 12 months`,repoHint:{en:"github.com/dhis2 — monorepo with backend, frontend, Android app, and documentation. Free for governments. dhis2.org has a live demo instance. Used by WHO and UNICEF for global health programmes.",th:"github.com/dhis2 — monorepo มีทั้งแบ็กเอนด์ ฟรอนต์เอนด์ แอป Android และเอกสาร ฟรีสำหรับรัฐบาล dhis2.org มีอินสแตนซ์ demo สด ใช้โดย WHO และ UNICEF",zh:"github.com/dhis2 — 包含后端、前端、Android 应用和文档的 monorepo。对政府免费。dhis2.org 有实时演示实例。WHO 和 UNICEF 均使用 DHIS2 开展全球卫生项目。"},tags:["health","HMIS","open-source","WHO","data-collection","offline-first","GIS"],image:"photos/report-people-workshop.jpg"},{id:"polis",title:"pol.is",city:"Taipei",country:"Taiwan",category:"governance",problem:"Traditional public consultations produced a flood of unstructured comments that no one read. Minority groups drowned out moderate majorities. Governments could not find consensus even when it existed.",solution:"pol.is uses machine learning to cluster opinions into consensus groups without participants needing to read every comment. Citizens vote agree/disagree/pass on short statements. The algorithm finds which statements cut across group lines — areas of genuine common ground — and surfaces them to decision-makers.",impact:"Used by vTaiwan to reach consensus on Uber regulation — a decision that was then implemented by the government. Deployed for AI governance deliberation in Taiwan and Scotland. The UK government piloted it for climate consultation. Open-source, self-hostable.",techStack:["Node.js","React","Python","K-means clustering","PCA","PostgreSQL","Docker"],difficulty:"advanced",codeSnippet:`# Self-host pol.is with Docker
# github.com/compdemocracy/polis

git clone https://github.com/compdemocracy/polis
cd polis

# Copy environment config
cp example.env .env
# Edit .env: set DOMAIN, EMAIL_TRANSPORT settings

# Start all services (API, client, math worker, postgres, nginx)
docker compose up -d

# Create a new conversation via API
curl -X POST http://localhost/api/v3/conversations \\
  -H "Content-Type: application/json" \\
  -d '{
    "topic": "Should e-scooters be allowed on pavements?",
    "description": "Help us find common ground on micromobility rules.",
    "is_public": true,
    "owner_sees_participation_stats": true
  }'

# Returns: { "conversation_id": "2ez5apmxud" }

# Add a seed comment for participants to react to
curl -X POST http://localhost/api/v3/comments \\
  -H "Content-Type: application/json" \\
  -d '{
    "conversation_id": "2ez5apmxud",
    "txt": "E-scooters should only use dedicated cycle lanes."
  }'`,repoHint:{en:"github.com/compdemocracy/polis — full platform with math server, API, and React client. The hosted version at pol.is is free for small consultations. Taiwan's vTaiwan process documentation is at vTaiwan.tw.",th:"github.com/compdemocracy/polis — แพลตฟอร์มเต็มพร้อมเซิร์ฟเวอร์คณิตศาสตร์ API และไคลเอนต์ React เวอร์ชันโฮสต์ที่ pol.is ฟรีสำหรับการปรึกษาขนาดเล็ก เอกสารกระบวนการ vTaiwan ที่ vTaiwan.tw",zh:"github.com/compdemocracy/polis — 包含数学服务器、API 和 React 客户端的完整平台。pol.is 托管版对小型咨询免费。台湾 vTaiwan 流程文档见 vTaiwan.tw。"},tags:["deliberation","consensus","AI","democracy","civic-tech","Taiwan","open-source"],image:"photos/report-origin-dialogue.jpg"},{id:"sensor-community",title:"Sensor.Community",city:"Stuttgart",country:"Germany",category:"sustainability",problem:"Government air quality stations cost €50,000 each and were placed kilometres apart. Citizens in polluted streets had no data. Stuttgart had some of the worst air in Germany and almost no granular measurements.",solution:"Sensor.Community is a DIY citizen sensor network. Anyone can build a PM2.5/PM10 sensor for €30–50 using an ESP8266 microcontroller and a Nova SDS011 sensor, connect it to their home WiFi, and start contributing hyperlocal air quality data to an open global map.",impact:"14,000+ active sensors in 70+ countries. Stuttgart went from 2 government stations to 300+ citizen sensors in three years. The data directly influenced traffic bans on high-pollution days in Germany. Now one of the densest air quality networks in the world.",techStack:["ESP8266/ESP32","Arduino C++","JSON API","InfluxDB","Grafana"],difficulty:"starter",codeSnippet:`// Query live sensor data from Sensor.Community API
// No API key required — fully open

// Get PM2.5 readings from all sensors within 15km of a city
const getSensorData = async (lat, lng, distanceKm = 15) => {
  const url = "https://data.sensor.community/airrohr/v1/filter/area=" +
    \`\${lat},\${lng},\${distanceKm}\`;

  const data = await fetch(url).then(r => r.json());

  return data
    .filter(s => s.sensordatavalues?.length > 0)
    .map(s => {
      const pm25 = s.sensordatavalues.find(v => v.value_type === "P2");
      const pm10 = s.sensordatavalues.find(v => v.value_type === "P1");
      return {
        id: s.id,
        lat: parseFloat(s.location.latitude),
        lng: parseFloat(s.location.longitude),
        pm25: pm25 ? parseFloat(pm25.value) : null,
        pm10: pm10 ? parseFloat(pm10.value) : null,
        timestamp: s.timestamp,
      };
    })
    .filter(s => s.pm25 !== null);
};

// Example: Bangkok area
getSensorData(13.75, 100.5).then(sensors => {
  console.log(\`Found \${sensors.length} sensors\`);
  sensors.forEach(s =>
    console.log(\`[Sensor \${s.id}] PM2.5: \${s.pm25} µg/m³\`)
  );
});`,repoHint:{en:"github.com/opendata-stuttgart/sensors-software — complete ESP8266/ESP32 firmware. Build guide at sensor.community/en/sensors/airrohr. Data API at data.sensor.community (no auth required).",th:"github.com/opendata-stuttgart/sensors-software — เฟิร์มแวร์ ESP8266/ESP32 ครบชุด คู่มือการสร้างที่ sensor.community/en/sensors/airrohr Data API ที่ data.sensor.community (ไม่ต้องยืนยันตัวตน)",zh:"github.com/opendata-stuttgart/sensors-software — 完整 ESP8266/ESP32 固件。构建指南见 sensor.community/en/sensors/airrohr。数据 API 在 data.sensor.community（无需认证）。"},tags:["DIY","IoT","air-quality","sensors","citizen-science","ESP8266","open-data"],image:"photos/slic-waterfront.jpg"},{id:"opentripplanner",title:"OpenTripPlanner",city:"Portland",country:"USA",category:"mobility",problem:"Existing routing apps handled cars well. But a trip from Sukhumvit to the airport involving BTS, a bus, and a walk had no unified planner. Each mode required a different app. Transfers were invisible.",solution:"OpenTripPlanner (OTP) takes a city's GTFS transit feeds and OpenStreetMap data and produces a multi-modal routing engine. Walk from door to bus stop, transfer to metro, exit and cycle to destination — in one trip, with live arrival times when GTFS-RT is connected.",impact:"Powers transit routing for Helsinki (Digitransit), New Zealand, Grenoble, Atlanta MARTA, and dozens more. The GraphQL API makes it trivially easy to embed in any app. Finland's national routing runs entirely on OTP.",techStack:["Java","GTFS","GTFS-RT","OpenStreetMap","GraphQL","Docker"],difficulty:"intermediate",codeSnippet:`# Start OpenTripPlanner with Docker + your city's GTFS data
# Replace the GTFS URL with your transit agency's feed

docker run -it --rm \\
  -v $(pwd)/data:/var/opentripplanner \\
  -p 8080:8080 \\
  opentripplanner/opentripplanner:latest \\
  --build --serve

# Place these files in ./data/ before running:
# - your_city.gtfs.zip  (from your transit agency)
# - your_city.osm.pbf   (from download.geofabrik.de)

# Then query via GraphQL (OTP 2.x):
# POST http://localhost:8080/otp/routers/default/index/graphql

query {
  plan(
    from: { lat: 13.7563, lon: 100.5018 }
    to:   { lat: 13.6900, lon: 100.7501 }
    numItineraries: 3
    transportModes: [
      { mode: WALK }
      { mode: BUS }
      { mode: SUBWAY }
    ]
  ) {
    itineraries {
      duration
      legs {
        mode startTime endTime distance
        from { name }
        to   { name }
        route { shortName longName }
      }
    }
  }
}`,repoHint:{en:"github.com/opentripplanner/OpenTripPlanner — 2,600+ stars. Full docs at docs.opentripplanner.org. Helsinki's implementation (github.com/HSLdevcom/digitransit-ui) shows a production UI built on top of OTP.",th:"github.com/opentripplanner/OpenTripPlanner — 2,600+ ดาว เอกสารเต็มที่ docs.opentripplanner.org การใช้งานของ Helsinki (github.com/HSLdevcom/digitransit-ui) แสดง UI การผลิตที่สร้างบน OTP",zh:"github.com/opentripplanner/OpenTripPlanner — 2,600+ 星。完整文档见 docs.opentripplanner.org。赫尔辛基的实现 (github.com/HSLdevcom/digitransit-ui) 展示了基于 OTP 构建的生产 UI。"},tags:["multi-modal","routing","GTFS","transit","open-source","navigation","Java"],image:"photos/report-city-night.jpg"},{id:"openenergymonitor",title:"OpenEnergyMonitor",city:"Bristol",country:"UK",category:"smart-infrastructure",problem:"Cities committed to net-zero targets with no granular data on where energy was actually being consumed. Building-level monitoring required expensive proprietary systems. Community energy projects had no shared platform.",solution:"OpenEnergyMonitor is open-source hardware and software for monitoring electricity, heat, and solar generation at building and district level. The emonPi device clips onto electricity cables non-invasively, pushes readings to the emoncms dashboard, and feeds into district-level heat maps.",impact:"10,000+ installations worldwide. Powers community energy monitoring in Bristol (Easton Energy Group), Scotland (Community Energy Scotland), and rural cooperatives across Europe. Every hardware design file and line of code is public.",techStack:["PHP","MySQL","Node-RED","MQTT","Raspberry Pi","Arduino","REST API"],difficulty:"intermediate",codeSnippet:`# Query an emoncms instance for feed data
# Works with self-hosted emoncms or the hosted service at emoncms.org

BASE_URL = "https://emoncms.org"  # or your self-hosted URL
API_KEY = "your_read_api_key"

import requests
from datetime import datetime, timedelta

def get_feed_data(feed_id: int, hours_back: int = 24) -> list:
    """Fetch hourly energy data for a feed."""
    end = int(datetime.now().timestamp())
    start = int((datetime.now() - timedelta(hours=hours_back)).timestamp())

    resp = requests.get(f"{BASE_URL}/feed/data.json", params={
        "id": feed_id,
        "start": start * 1000,   # emoncms uses milliseconds
        "end": end * 1000,
        "interval": 3600,        # 1-hour intervals
        "skipmissing": 1,
        "apikey": API_KEY,
    })
    # Returns: [[timestamp_ms, value_watts], ...]
    data = resp.json()
    return [
        {"time": datetime.fromtimestamp(d[0] / 1000), "watts": d[1]}
        for d in data
    ]

readings = get_feed_data(feed_id=1, hours_back=48)
total_kwh = sum(r["watts"] for r in readings) / 1000
print(f"Total consumption last 48h: {total_kwh:.2f} kWh")`,repoHint:{en:"github.com/emoncms/emoncms — 1,300+ stars. Hardware designs at github.com/openenergymonitor. The hosted service emoncms.org lets you start free. Full community forum at community.openenergymonitor.org.",th:"github.com/emoncms/emoncms — 1,300+ ดาว การออกแบบฮาร์ดแวร์ที่ github.com/openenergymonitor บริการโฮสต์ emoncms.org ให้เริ่มได้ฟรี ฟอรัมชุมชนเต็มที่ community.openenergymonitor.org",zh:"github.com/emoncms/emoncms — 1,300+ 星。硬件设计见 github.com/openenergymonitor。托管服务 emoncms.org 可免费开始使用。完整社区论坛在 community.openenergymonitor.org。"},tags:["energy","IoT","smart-grid","monitoring","open-hardware","net-zero","raspberry-pi"],image:"photos/slic-skyline.jpg"},{id:"vroom",title:"VROOM",city:"Paris",country:"France",category:"smart-infrastructure",problem:"Municipal waste trucks drove fixed routes regardless of which bins were full. Delivery services crisscrossed the same streets. On-demand bus routes were assigned by human dispatchers under time pressure. All of this wasted fuel, time, and money.",solution:"VROOM (Vehicle Routing Open-source Optimization Machine) solves Vehicle Routing Problems in milliseconds. You give it a list of vehicles with start/end locations and a list of jobs with coordinates and time windows. It returns the optimal route allocation, minimising distance and time.",impact:"Used by municipalities in France, Belgium, and Canada for waste route optimisation. Deployed in last-mile delivery platforms serving millions of daily deliveries. 1,700+ GitHub stars. The JSON API makes integration trivial — any city IT department can connect it to existing fleet software.",techStack:["C++20","Node.js","Express","REST API","Docker"],difficulty:"advanced",codeSnippet:`// VROOM REST API — optimise routes for 3 vehicles, 6 pickup jobs
// docker run -p 3000:3000 vroomvrp/vroom-express

const response = await fetch("http://localhost:3000/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    vehicles: [
      { id: 0, start: [2.3526, 48.8604], end: [2.3526, 48.8604], capacity: [4] },
      { id: 1, start: [2.2911, 48.8566], end: [2.2911, 48.8566], capacity: [4] },
      { id: 2, start: [2.3691, 48.8532], end: [2.3691, 48.8532], capacity: [4] },
    ],
    jobs: [
      { id: 1, location: [2.3600, 48.8700], amount: [1] },
      { id: 2, location: [2.2800, 48.8650], amount: [1] },
      { id: 3, location: [2.3400, 48.8450], amount: [2] },
      { id: 4, location: [2.3100, 48.8800], amount: [1] },
      { id: 5, location: [2.3750, 48.8500], amount: [2] },
      { id: 6, location: [2.2950, 48.8720], amount: [1] },
    ],
    options: { g: true },  // include geometry for map display
  }),
});

const result = await response.json();
// result.routes: per-vehicle ordered stop sequences
// result.summary: total distance, duration, unassigned jobs
result.routes.forEach(r =>
  console.log(\`Vehicle \${r.vehicle}: \${r.steps.length} stops, \${r.duration}s, \${(r.distance/1000).toFixed(1)}km\`)
);`,repoHint:{en:"github.com/VROOM-Project/vroom — C++ core (1,700+ stars). github.com/VROOM-Project/vroom-express — the Node.js REST wrapper (deploy with Docker in one command). Full docs at vroom-project.org.",th:"github.com/VROOM-Project/vroom — C++ core (1,700+ ดาว) github.com/VROOM-Project/vroom-express — Node.js REST wrapper (deploy ด้วย Docker ในคำสั่งเดียว) เอกสารเต็มที่ vroom-project.org",zh:"github.com/VROOM-Project/vroom — C++ 核心（1,700+ 星）。github.com/VROOM-Project/vroom-express — Node.js REST 封装（一条命令 Docker 部署）。完整文档见 vroom-project.org。"},tags:["routing","optimisation","logistics","waste-management","fleet","VRP","open-source"],image:"photos/report-city-kuching.jpg"},{id:"freifunk",title:"Freifunk",city:"Berlin",country:"Germany",category:"community",problem:"Public WiFi was expensive, patchy, and controlled by commercial operators who tracked users, sold their data, and turned off access the moment their contract ended. Poor neighbourhoods had none at all.",solution:"Freifunk is a community-run mesh WiFi network. Volunteers buy off-the-shelf routers (€30–80), flash them with OpenWrt and the Freifunk firmware, and place them in windows or on rooftops. Each device connects to neighbours and shares internet upstream — creating a self-healing mesh that grows organically.",impact:"800+ local communities across Germany. Berlin alone has 1,000+ active nodes. Deployed in refugee camps, public squares, community centres, and libraries. The model has been replicated in Austria, Switzerland, Luxembourg, and urban areas globally. Zero corporate involvement required.",techStack:["OpenWrt","B.A.T.M.A.N. (mesh protocol)","Lua","UCI","Linux"],difficulty:"starter",codeSnippet:`# Flash a standard router to join a Freifunk mesh network
# Works on TP-Link, GL.iNet, Ubiquiti, and many others

# Step 1: Download Freifunk firmware for your router model
# https://firmware.freifunk-muenchen.de  (Munich community as example)
# Select your router model → download .bin file

# Step 2: Flash via router's standard web interface
# Or via command line if already running OpenWrt:
sysupgrade -n /tmp/freifunk-firmware.bin

# Step 3: After reboot, configure via UCI (Unified Configuration Interface)
# SSH into router at 192.168.1.1
uci set freifunk.@settings[0].community='berlin'
uci set network.mesh.ipaddr='10.31.x.x'       # get from community wiki
uci set freifunk.@settings[0].contact='yourname@example.com'
uci commit
/etc/init.d/network restart

# Step 4: Register your node on the community map
# POST your node info to the community's node database:
curl -X POST https://api.meshtastic.de/nodes \\
  -H "Content-Type: application/json" \\
  -d '{"name":"MyNode","lat":52.52,"lon":13.40,"contact":"you@example.com"}'`,repoHint:{en:"github.com/freifunk — umbrella organisation with firmware, map, and tools. freifunk.net lists all active communities. The gluon firmware (github.com/freifunk-gluon/gluon) is the most widely deployed mesh OS.",th:"github.com/freifunk — องค์กรหลักพร้อมเฟิร์มแวร์ แผนที่ และเครื่องมือ freifunk.net แสดงชุมชนที่ใช้งานอยู่ทั้งหมด เฟิร์มแวร์ gluon (github.com/freifunk-gluon/gluon) คือ mesh OS ที่ deploy แพร่หลายที่สุด",zh:"github.com/freifunk — 包含固件、地图和工具的伞形组织。freifunk.net 列出所有活跃社区。gluon 固件 (github.com/freifunk-gluon/gluon) 是部署最广泛的 mesh 操作系统。"},tags:["WiFi","mesh-network","community","OpenWrt","open-source","digital-equity","DIY"],image:"photos/slic-night-square.jpg"}],h=[{value:"citizen-reporting",labels:{en:"Citizen Reporting",th:"การแจ้งเหตุโดยพลเมือง",zh:"市民举报"}},{value:"smart-infrastructure",labels:{en:"Smart Infrastructure",th:"โครงสร้างพื้นฐานอัจฉริยะ",zh:"智慧基础设施"}},{value:"civic-ai",labels:{en:"Civic AI",th:"AI เพื่อพลเมือง",zh:"公共 AI"}},{value:"mobility",labels:{en:"Mobility",th:"การเดินทาง",zh:"交通出行"}},{value:"sustainability",labels:{en:"Sustainability",th:"ความยั่งยืน",zh:"可持续性"}},{value:"community",labels:{en:"Community",th:"ชุมชน",zh:"社区"}},{value:"governance",labels:{en:"Governance",th:"ธรรมาภิบาล",zh:"治理"}},{value:"health",labels:{en:"Health",th:"สุขภาพ",zh:"健康"}}],v="/SLIC-Index/".replace(/\/$/,""),S={starter:"var(--accent-green)",intermediate:"var(--accent-amber)",advanced:"var(--accent-red)"},g={en:{title:"Steal This Idea",eyebrow:"Open-source civic tech",intro:"Forty years of urban innovation, one afternoon to ship. Every tool here is open source, globally deployed, and proven in a real city. Clone the repo. Change the city name. Go.",statTools:"12 open-source tools",statCountries:"40+ countries deployed",statPeople:"1 billion+ people served",category:"Category",difficulty:"Difficulty",all:"All",starter:"Starter",intermediate:"Intermediate",advanced:"Advanced",countSuffix:"ideas",sectionHeading:"12 tools. Real cities. Free to clone.",sectionSummary:"Click any card to see the working code. Every snippet connects to a live GitHub repo.",problem:"Problem",solution:"Solution",impact:"Impact",showCode:"Show code",hideCode:"Hide code",starterCode:"Starter code",copyCode:"Copy code",copied:"Copied!",categoryAria:"Idea category filter",difficultyAria:"Idea difficulty filter",stackLabel:"Stack",tagsLabel:"Tags"},th:{title:"ขโมยไอเดียนี้ไปใช้",eyebrow:"เทคโนโลยีเมืองแบบโอเพนซอร์ส",intro:"นวัตกรรมเมือง 40 ปี บ่ายเดียวก็ deploy ได้ ทุกเครื่องมือที่นี่เป็นโอเพนซอร์ส ใช้งานจริงทั่วโลก และพิสูจน์แล้วในเมืองจริง โคลน repo เปลี่ยนชื่อเมือง แค่นั้น",statTools:"12 เครื่องมือโอเพนซอร์ส",statCountries:"deploy แล้วใน 40+ ประเทศ",statPeople:"คนกว่า 1 พันล้านได้ใช้",category:"หมวดหมู่",difficulty:"ระดับความยาก",all:"ทั้งหมด",starter:"เริ่มต้น",intermediate:"ปานกลาง",advanced:"ขั้นสูง",countSuffix:"ไอเดีย",sectionHeading:"12 เครื่องมือ เมืองจริง โคลนได้ฟรี",sectionSummary:"คลิกที่การ์ดใดก็ได้เพื่อดูโค้ดที่ใช้งานได้จริง ทุก snippet เชื่อมต่อกับ GitHub repo สด",problem:"ปัญหา",solution:"ทางออก",impact:"ผลลัพธ์",showCode:"แสดงโค้ด",hideCode:"ซ่อนโค้ด",starterCode:"โค้ดเริ่มต้น",copyCode:"คัดลอกโค้ด",copied:"คัดลอกแล้ว!",categoryAria:"ตัวกรองหมวดหมู่ไอเดีย",difficultyAria:"ตัวกรองระดับความยาก",stackLabel:"ชุดเทคโนโลยี",tagsLabel:"แท็ก"},zh:{title:"拿去用吧",eyebrow:"开源城市科技",intro:"四十年的城市创新，一个下午就能上线。这里的每个工具都是开源的，已在真实城市全球部署并验证。克隆仓库，改个城市名，出发。",statTools:"12 个开源工具",statCountries:"部署至 40+ 个国家",statPeople:"服务超 10 亿人",category:"类别",difficulty:"难度",all:"全部",starter:"入门",intermediate:"中级",advanced:"高级",countSuffix:"个想法",sectionHeading:"12 个工具。真实城市。免费克隆。",sectionSummary:"点击任意卡片查看可用代码片段。每个片段都连接到一个实时 GitHub 仓库。",problem:"问题",solution:"方案",impact:"影响",showCode:"显示代码",hideCode:"隐藏代码",starterCode:"起始代码",copyCode:"复制代码",copied:"已复制！",categoryAria:"想法类别筛选",difficultyAria:"想法难度筛选",stackLabel:"技术栈",tagsLabel:"标签"}},w={en:{starter:"Starter",intermediate:"Intermediate",advanced:"Advanced"},th:{starter:"เริ่มต้น",intermediate:"ปานกลาง",advanced:"ขั้นสูง"},zh:{starter:"入门",intermediate:"中级",advanced:"高级"}};function k({text:p,locale:a}){const[n,l]=m.useState(!1),o=g[a];function r(){navigator.clipboard.writeText(p).then(()=>{l(!0),setTimeout(()=>l(!1),2e3)})}return e.jsx("button",{type:"button",className:"idea-copy-btn",onClick:r,children:n?o.copied:o.copyCode})}function T({onNavigate:p,locale:a}){const[n,l]=m.useState("all"),[o,r]=m.useState("all"),[d,y]=m.useState(null),i=g[a],u=m.useMemo(()=>{let t=[...b];return n!=="all"&&(t=t.filter(c=>c.category===n)),o!=="all"&&(t=t.filter(c=>c.difficulty===o)),t},[n,o]);return e.jsxs(e.Fragment,{children:[e.jsx("header",{className:"rankings-hero section",children:e.jsxs("div",{className:"rankings-hero-grid",children:[e.jsxs("div",{children:[e.jsx("p",{className:"eyebrow",children:i.eyebrow}),e.jsx("h1",{className:"rankings-title",children:i.title}),e.jsx("p",{className:"hero-intro",children:i.intro}),e.jsxs("div",{className:"ideas-hero-stats",children:[e.jsx("span",{children:i.statTools}),e.jsx("span",{children:i.statCountries}),e.jsx("span",{children:i.statPeople})]})]}),e.jsxs("div",{className:"rankings-controls",children:[e.jsxs("div",{className:"rankings-filter-group",children:[e.jsx("p",{className:"panel-label",children:i.category}),e.jsxs("div",{className:"region-switch",role:"group","aria-label":i.categoryAria,children:[e.jsx("button",{type:"button",className:n==="all"?"region-button active":"region-button",onClick:()=>l("all"),children:i.all}),h.map(t=>e.jsx("button",{type:"button",className:n===t.value?"region-button active":"region-button",onClick:()=>l(t.value),children:t.labels[a]},t.value))]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"panel-label",children:i.difficulty}),e.jsxs("div",{className:"mode-switch",role:"group","aria-label":i.difficultyAria,children:[e.jsx("button",{type:"button",className:o==="all"?"mode-button active":"mode-button",onClick:()=>r("all"),children:i.all}),e.jsx("button",{type:"button",className:o==="starter"?"mode-button active":"mode-button",onClick:()=>r("starter"),children:i.starter}),e.jsx("button",{type:"button",className:o==="intermediate"?"mode-button active":"mode-button",onClick:()=>r("intermediate"),children:i.intermediate}),e.jsx("button",{type:"button",className:o==="advanced"?"mode-button active":"mode-button",onClick:()=>r("advanced"),children:i.advanced})]})]})]})]})}),e.jsx("main",{children:e.jsxs("section",{className:"rankings-top section",children:[e.jsxs("div",{className:"section-heading",children:[e.jsxs("div",{children:[e.jsxs("p",{className:"eyebrow",children:[u.length," ",i.countSuffix]}),e.jsx("h2",{children:i.sectionHeading})]}),e.jsx("p",{className:"section-summary",children:i.sectionSummary})]}),e.jsx("div",{className:"idea-grid",children:u.map(t=>{var c;return e.jsxs("article",{className:"idea-card",children:[t.image&&e.jsx("div",{className:"idea-card-photo",children:e.jsx("img",{src:`${v}/${t.image}`,alt:`${t.city} — ${t.title}`,loading:"lazy"})}),e.jsx("div",{className:"idea-card-head",children:e.jsxs("div",{children:[e.jsxs("div",{className:"idea-card-meta",children:[e.jsx("span",{className:"idea-difficulty",style:{color:S[t.difficulty]},children:w[a][t.difficulty]}),e.jsx("span",{className:"idea-category",children:(c=h.find(s=>s.value===t.category))==null?void 0:c.labels[a]})]}),e.jsx("h3",{children:t.title}),e.jsxs("p",{className:"city-location",children:[t.city,", ",t.country]})]})}),e.jsxs("p",{className:"idea-problem",children:[e.jsxs("strong",{children:[i.problem,":"]})," ",t.problem]}),e.jsxs("p",{className:"idea-solution",children:[e.jsxs("strong",{children:[i.solution,":"]})," ",t.solution]}),e.jsxs("p",{className:"idea-impact",children:[e.jsxs("strong",{children:[i.impact,":"]})," ",t.impact]}),e.jsxs("div",{className:"metric-taglist-group",children:[e.jsx("span",{className:"metric-taglist-label",children:i.stackLabel}),e.jsx("div",{className:"metric-taglist",children:t.techStack.map(s=>e.jsx("span",{children:s},s))})]}),e.jsx("button",{type:"button",className:d===t.id?"idea-toggle active":"idea-toggle",onClick:()=>y(d===t.id?null:t.id),"aria-expanded":d===t.id,children:d===t.id?i.hideCode:i.showCode}),d===t.id&&e.jsxs("div",{className:"idea-code-block",children:[e.jsxs("div",{className:"idea-code-header",children:[e.jsx("span",{children:i.starterCode}),e.jsx(k,{text:t.codeSnippet,locale:a})]}),e.jsx("pre",{className:"idea-code",children:e.jsx("code",{children:t.codeSnippet})}),e.jsx("p",{className:"idea-repo-hint",children:t.repoHint[a]})]}),e.jsxs("div",{className:"metric-taglist-group",children:[e.jsx("span",{className:"metric-taglist-label",children:i.tagsLabel}),e.jsx("div",{className:"metric-taglist metric-taglist--secondary",children:t.tags.map(s=>e.jsx("span",{children:s},s))})]})]},t.id)})})]})}),e.jsx(f,{onNavigate:p,locale:a})]})}export{T as default};
