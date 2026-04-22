import{r as p,j as e}from"./index-DuNvUJcF.js";import{S as y}from"./SiteFooter-WWrpv_Q2.js";const b=[{id:"fixmystreet",title:"FixMyStreet",city:"London",country:"UK",category:"citizen-reporting",problem:"Citizens had no quick, centralised way to report potholes, broken street lights, or graffiti. Reports were lost across council phone lines and email inboxes.",solution:"FixMyStreet lets anyone drop a pin on a map, describe the issue, and attach a photo. The platform automatically routes the report to the correct local authority using boundary data. Councils receive structured tickets they can triage, assign, and close with public status updates.",impact:"Over 2 million reports filed across the UK, with average council response times dropping by 30% in participating boroughs.",techStack:["HTML","CSS","JavaScript","REST API","Leaflet.js","PostgreSQL"],difficulty:"starter",codeSnippet:`// FixMyStreet-style report submission form (vanilla JS)
// Drop this into an HTML page with a <form id="reportForm"> and a Leaflet map.

document.getElementById("reportForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const report = {
    latitude: parseFloat(document.getElementById("lat").value),
    longitude: parseFloat(document.getElementById("lng").value),
    category: document.getElementById("category").value,   // e.g. "pothole"
    description: document.getElementById("description").value,
    photo_url: document.getElementById("photoUrl").value || null,
    reported_at: new Date().toISOString(),
  };

  try {
    const res = await fetch("https://api.city.example/v1/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });
    const data = await res.json();
    alert(\`Report #\${data.id} submitted! Track it at /reports/\${data.id}\`);
  } catch (err) {
    console.error("Submission failed:", err);
    alert("Could not submit report. Please try again.");
  }
});`,repoHint:{en:"Search GitHub for 'mysociety/fixmystreet' — the original open-source Perl/Catalyst codebase that powers FixMyStreet.com and dozens of international forks.",th:"ค้นหา GitHub สำหรับ 'mysociety/fixmystreet' — โค้ด Perl/Catalyst ต้นฉบับแบบโอเพนซอร์สที่ขับเคลื่อน FixMyStreet.com และ fork นานาชาติอีกหลายสิบแห่ง",zh:"在 GitHub 上搜索 'mysociety/fixmystreet' — FixMyStreet.com 及其数十个国际分支背后的开源 Perl/Catalyst 原始代码库。"},tags:["open-source","civic-tech","reporting","map","local-government"]},{id:"seoul-digital-mayor",title:"Seoul Digital Mayor's Office",city:"Seoul",country:"South Korea",category:"civic-ai",problem:"Seoul's 10-million-plus residents overwhelmed call centres with repetitive questions about permits, taxes, and public services. Wait times exceeded 20 minutes at peak hours.",solution:"The Digital Mayor's Office deployed an AI chatbot that understands natural-language queries in Korean and English, classifies them by department, and either answers directly from a knowledge base or escalates to a human agent with full context. The system continuously learns from resolved tickets to improve future routing accuracy.",impact:"Call centre volume dropped 35% within the first year, and citizen satisfaction scores for city services rose by 12 percentage points.",techStack:["Python","FastAPI","OpenAI API","PostgreSQL","Redis","Docker"],difficulty:"intermediate",codeSnippet:`# Civic AI query router -- classifies a citizen question and drafts a response.
# Requires: pip install openai

import openai

DEPARTMENT_PROMPT = """You are a municipal services assistant for a large city.
Given a citizen's question, respond with JSON:
{
  "department": "one of: tax, permits, transit, waste, housing, health, other",
  "answer": "a concise, helpful answer (2-3 sentences)",
  "needs_human": true/false
}
Only set needs_human to true if the question involves a complaint, legal issue,
or something you cannot answer from general municipal knowledge."""

def route_citizen_query(question: str) -> dict:
    """Classify and answer a citizen query using an LLM."""
    client = openai.OpenAI()  # uses OPENAI_API_KEY env var
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": DEPARTMENT_PROMPT},
            {"role": "user", "content": question},
        ],
        temperature=0.2,
    )
    import json
    return json.loads(response.choices[0].message.content)

# Example usage:
# result = route_citizen_query("How do I renew my business permit?")
# print(result)
# => {"department": "permits", "answer": "You can renew ...", "needs_human": false}`,repoHint:{en:"Look at 'langchain-ai/langchain' for retrieval-augmented generation patterns, or 'run-llama/llama_index' for building knowledge-base chatbots over municipal documents.",th:"ดู 'langchain-ai/langchain' สำหรับแพทเทิร์น retrieval-augmented generation หรือ 'run-llama/llama_index' สำหรับสร้างแชตบ็อตฐานความรู้บนเอกสารราชการ",zh:"可参考 'langchain-ai/langchain' 了解检索增强生成模式，或 'run-llama/llama_index' 用于在市政文档上构建知识库聊天机器人。"},tags:["AI","chatbot","NLP","citizen-services","automation"]},{id:"barcelona-superblocks",title:"Barcelona Superblocks",city:"Barcelona",country:"Spain",category:"mobility",problem:"Barcelona's Eixample grid suffered from severe traffic congestion and air pollution, with NO2 levels consistently above EU limits. Pedestrians competed with cars for limited public space.",solution:"The Superblocks programme groups nine city blocks into a single 'superblock' where through-traffic is redirected to perimeter roads. Interior streets become shared spaces for pedestrians, cyclists, and play. Sensor networks measure traffic flow before and after implementation to guide iterative redesign.",impact:"Pilot superblocks reduced vehicle traffic by 25% inside treated areas and cut NO2 levels by 20-25%, while local retail foot traffic increased.",techStack:["Python","pandas","Matplotlib","GIS / QGIS","traffic sensors"],difficulty:"intermediate",codeSnippet:`# Superblock traffic analysis -- compare vehicle counts before/after intervention.
# Requires: pip install pandas matplotlib

import pandas as pd
import matplotlib.pyplot as plt

# Sample sensor data: hourly vehicle counts at an intersection
data = {
    "hour": list(range(24)) * 2,
    "vehicles": [
        # Before superblock (24 hrs)
        120, 80, 45, 30, 35, 90, 250, 480, 520, 430, 390, 410,
        450, 420, 400, 460, 510, 540, 480, 350, 280, 210, 180, 150,
        # After superblock (24 hrs)
        90, 60, 30, 20, 25, 60, 160, 310, 340, 280, 250, 270,
        300, 280, 260, 300, 340, 370, 320, 230, 180, 140, 120, 100,
    ],
    "period": ["before"] * 24 + ["after"] * 24,
}

df = pd.DataFrame(data)

fig, ax = plt.subplots(figsize=(10, 5))
for label, group in df.groupby("period"):
    ax.plot(group["hour"], group["vehicles"], marker="o", label=label.capitalize())

ax.set_xlabel("Hour of day")
ax.set_ylabel("Vehicles per hour")
ax.set_title("Superblock impact: vehicle counts at Carrer de Girona")
ax.legend()
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig("superblock_traffic.png", dpi=150)
print(f"Before avg: {df[df.period=='before'].vehicles.mean():.0f} veh/hr")
print(f"After avg:  {df[df.period=='after'].vehicles.mean():.0f} veh/hr")
print(f"Reduction:  {1 - df[df.period=='after'].vehicles.mean() / df[df.period=='before'].vehicles.mean():.1%}")`,repoHint:{en:"Search GitHub for 'cityflows' or 'uber/kepler.gl' for open-source traffic visualisation tools. Also see 'a-b-street/abstreet' for urban traffic simulation.",th:"ค้นหา GitHub สำหรับ 'cityflows' หรือ 'uber/kepler.gl' เครื่องมือโอเพนซอร์สแสดงภาพการจราจร และดู 'a-b-street/abstreet' สำหรับการจำลองการจราจรในเมือง",zh:"在 GitHub 搜索 'cityflows' 或 'uber/kepler.gl' 等开源交通可视化工具。亦可参考 'a-b-street/abstreet' 用于城市交通仿真。"},tags:["urban-design","traffic","data-analysis","pedestrian","air-quality"]},{id:"taipei-itrash",title:"Taipei iTrash",city:"Taipei",country:"Taiwan",category:"smart-infrastructure",problem:"Taipei's waste collection relied on musical garbage trucks that residents had to chase on foot. Missed pickups meant bags piling up on sidewalks.",solution:"The iTrash system equips every garbage truck with a GPS transponder broadcasting its real-time location to a public API. A companion app and web map show the truck's ETA for each stop, letting residents time their trip to the kerb. Smart bins at high-traffic locations weigh incoming waste and send fill-level data to optimise routes.",impact:"Missed-collection complaints fell by 40%, and route optimisation reduced fuel consumption by 15% across the fleet.",techStack:["JavaScript","Leaflet.js","WebSocket","GPS trackers","Node.js"],difficulty:"starter",codeSnippet:`// Real-time garbage truck tracker using Leaflet and a WebSocket feed.
// Drop into an HTML page with <div id="map" style="height:100vh"></div>
// Requires: leaflet CSS/JS from CDN

const map = L.map("map").setView([25.033, 121.565], 13); // Taipei centre

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const truckIcon = L.icon({
  iconUrl: "/icons/truck.png",  // swap for your own icon
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const trucks = {};  // truckId -> L.marker

// Connect to the city's real-time GPS feed
const ws = new WebSocket("wss://api.city.example/ws/trucks");

ws.onmessage = (event) => {
  const { truckId, lat, lng, route, eta } = JSON.parse(event.data);

  if (trucks[truckId]) {
    // Update existing marker position smoothly
    trucks[truckId].setLatLng([lat, lng]);
    trucks[truckId].setPopupContent(
      \`<b>Truck \${truckId}</b><br>Route: \${route}<br>Next stop ETA: \${eta}\`
    );
  } else {
    // Create new marker for this truck
    trucks[truckId] = L.marker([lat, lng], { icon: truckIcon })
      .addTo(map)
      .bindPopup(\`<b>Truck \${truckId}</b><br>Route: \${route}\`);
  }
};

ws.onerror = (err) => console.error("WebSocket error:", err);`,repoHint:{en:"Look at 'transitland/transitland-server' for GTFS-based transit APIs, or 'openstreetmap/leaflet' for map rendering. Search for 'fleet-tracking open source' on GitHub.",th:"ดู 'transitland/transitland-server' สำหรับ API การขนส่งบน GTFS หรือ 'openstreetmap/leaflet' สำหรับการเรนเดอร์แผนที่ ค้นหา 'fleet-tracking open source' บน GitHub",zh:"可参考 'transitland/transitland-server' 了解基于 GTFS 的交通 API，或 'openstreetmap/leaflet' 用于地图渲染。在 GitHub 搜索 'fleet-tracking open source'。"},tags:["real-time","GPS","waste-management","maps","IoT"]},{id:"amsterdam-smart-traffic",title:"Amsterdam Smart Traffic",city:"Amsterdam",country:"Netherlands",category:"smart-infrastructure",problem:"Fixed-cycle traffic lights caused unnecessary idling at low-traffic intersections and long queues during peak hours, wasting fuel and increasing emissions.",solution:"Amsterdam installed induction loops and camera sensors at key intersections, feeding real-time vehicle and cyclist counts to a central controller. The controller dynamically adjusts green-phase durations, prioritises trams and emergency vehicles, and coordinates adjacent intersections to create 'green waves' along major corridors.",impact:"Average intersection wait times fell by 18%, and CO2 emissions along the A10 ring corridor dropped by an estimated 12%.",techStack:["Python","NumPy","MQTT","induction loops","OpenCV","PostgreSQL"],difficulty:"advanced",codeSnippet:`# Adaptive traffic light controller -- adjusts green phase from sensor data.
# Requires: pip install numpy paho-mqtt

import json
import numpy as np
import paho.mqtt.client as mqtt

# Configuration
MIN_GREEN = 10   # seconds
MAX_GREEN = 60   # seconds
BASE_GREEN = 25  # seconds

def calculate_green_time(vehicle_count: int, pedestrian_waiting: bool) -> int:
    """Compute optimal green phase duration based on demand."""
    # Linear scaling with demand, capped at MAX_GREEN
    green = BASE_GREEN + int(vehicle_count * 1.5)
    # Shorten vehicle phase if pedestrians are waiting and traffic is light
    if pedestrian_waiting and vehicle_count < 5:
        green = max(MIN_GREEN, green - 10)
    return int(np.clip(green, MIN_GREEN, MAX_GREEN))

def on_message(client, userdata, msg):
    """Handle incoming sensor readings from an intersection."""
    data = json.loads(msg.payload)
    intersection = data["intersection_id"]
    vehicles = data["vehicle_count"]        # from induction loop
    peds_waiting = data["pedestrian_button"] # boolean

    green = calculate_green_time(vehicles, peds_waiting)
    command = {"intersection_id": intersection, "green_seconds": green}

    client.publish(f"traffic/control/{intersection}", json.dumps(command))
    print(f"[{intersection}] vehicles={vehicles}  green={green}s")

client = mqtt.Client()
client.on_message = on_message
client.connect("mqtt.city.example", 1883)
client.subscribe("traffic/sensors/#")
print("Adaptive traffic controller running...")
client.loop_forever()`,repoHint:{en:"Explore 'eclipse/sumo' (Simulation of Urban Mobility) for traffic simulation, or 'CityFlow-project/CityFlow' for reinforcement-learning traffic signal control.",th:"สำรวจ 'eclipse/sumo' (Simulation of Urban Mobility) สำหรับการจำลองการจราจร หรือ 'CityFlow-project/CityFlow' สำหรับการควบคุมสัญญาณไฟจราจรด้วย reinforcement learning",zh:"探索 'eclipse/sumo'（城市交通仿真）用于交通模拟，或 'CityFlow-project/CityFlow' 用于强化学习的交通信号控制。"},tags:["IoT","sensors","traffic","real-time","emissions","MQTT"]},{id:"medellin-cable-cars",title:"Medellin Cable Cars (MetroCable)",city:"Medellin",country:"Colombia",category:"mobility",problem:"Steep hillside comunas had no direct transit links to the city centre. Residents faced 90-minute bus rides or dangerous informal transport to reach jobs and schools.",solution:"Medellin integrated aerial cable-car lines into the metro network, connecting hillside neighbourhoods directly to metro stations below. The system was designed with community input, and stations doubled as civic hubs with libraries, parks, and health clinics. Route planning used elevation and population-density data to maximise coverage per station.",impact:"Commute times for hillside residents dropped by up to 60%, and homicide rates in served comunas fell by over 70% within a decade of construction.",techStack:["Python","GeoPandas","elevation APIs","network analysis","QGIS"],difficulty:"intermediate",codeSnippet:`# Elevation-aware transit route planner -- finds optimal station placements
# by scoring candidate locations on elevation gain and population served.
# Requires: pip install requests geopy

import math
from dataclasses import dataclass

@dataclass
class CandidateStation:
    name: str
    lat: float
    lng: float
    elevation_m: float       # metres above sea level
    population_500m: int     # residents within 500m radius

def haversine_km(lat1, lon1, lat2, lon2) -> float:
    """Great-circle distance between two points in kilometres."""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))

def score_route(stations: list[CandidateStation], metro_lat: float, metro_lng: float) -> dict:
    """Score a proposed cable-car route from a metro station to hillside stops."""
    total_pop = sum(s.population_500m for s in stations)
    elevation_gain = max(s.elevation_m for s in stations) - min(s.elevation_m for s in stations)
    total_dist = sum(
        haversine_km(stations[i].lat, stations[i].lng, stations[i+1].lat, stations[i+1].lng)
        for i in range(len(stations) - 1)
    )
    return {
        "stations": [s.name for s in stations],
        "population_served": total_pop,
        "elevation_gain_m": elevation_gain,
        "route_length_km": round(total_dist, 2),
        "people_per_km": round(total_pop / total_dist, 0) if total_dist else 0,
    }

# Example candidates
candidates = [
    CandidateStation("Acevedo Metro", 6.2826, -75.5590, 1460, 3200),
    CandidateStation("Andalucia", 6.2870, -75.5545, 1580, 8500),
    CandidateStation("Popular", 6.2910, -75.5500, 1720, 12000),
    CandidateStation("Santo Domingo", 6.2960, -75.5460, 1880, 15000),
]

result = score_route(candidates, metro_lat=6.2826, metro_lng=-75.5590)
for k, v in result.items():
    print(f"  {k}: {v}")`,repoHint:{en:"Search for 'gboeing/osmnx' for street-network and elevation analysis with OpenStreetMap data, or 'uber/h3' for hexagonal spatial indexing of population density.",th:"ค้นหา 'gboeing/osmnx' สำหรับการวิเคราะห์เครือข่ายถนนและภูมิประเทศด้วย OpenStreetMap หรือ 'uber/h3' สำหรับการทำดัชนีเชิงพื้นที่แบบเฮกซาโกนัลของความหนาแน่นประชากร",zh:"搜索 'gboeing/osmnx' 用于基于 OpenStreetMap 的街道网络与高程分析，或 'uber/h3' 用于人口密度的六边形空间索引。"},tags:["transit","equity","elevation","urban-planning","community"]},{id:"singapore-oneservice",title:"Singapore OneService",city:"Singapore",country:"Singapore",category:"citizen-reporting",problem:"Singapore's municipal feedback was fragmented across dozens of agency hotlines. Citizens did not know which agency handled which issue, leading to misrouted reports and slow resolution.",solution:"OneService provides a single mobile app and web portal for all municipal feedback. AI-based image recognition auto-classifies uploaded photos (e.g., 'fallen tree', 'illegal parking'), and the system routes tickets to the correct agency without the citizen needing to know the bureaucratic structure. A public dashboard tracks resolution statistics by district.",impact:"Cross-agency routing accuracy reached 92%, and average case resolution time improved from 10 working days to 3.5.",techStack:["React","TypeScript","REST API","image classification","PostgreSQL"],difficulty:"starter",codeSnippet:`// OneService-style feedback form (React + TypeScript)
// A reusable component for submitting municipal feedback with photo upload.

import React, { useState, type FormEvent } from "react";

interface FeedbackPayload {
  category: string;
  description: string;
  location: { lat: number; lng: number };
  photoBase64: string | null;
}

const CATEGORIES = [
  "Roads & footpaths",
  "Cleanliness",
  "Noise & pollution",
  "Parks & trees",
  "Illegal parking",
  "Street lighting",
  "Other",
];

export default function FeedbackForm() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const payload: FeedbackPayload = {
      category,
      description,
      location: { lat: 1.3521, lng: 103.8198 }, // replace with real geolocation
      photoBase64: null, // attach Base64 from file input if needed
    };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(res.statusText);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Category</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
      </select>

      <label>Description</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Submitting..." : "Submit feedback"}
      </button>
      {status === "done" && <p>Thank you! Your report has been filed.</p>}
      {status === "error" && <p>Something went wrong. Please try again.</p>}
    </form>
  );
}`,repoHint:{en:"Look at 'open311/open311.github.io' for the Open311 standard used by many cities for service requests, or 'codeforamerica/open311dashboard' for a reference dashboard.",th:"ดู 'open311/open311.github.io' สำหรับมาตรฐาน Open311 ที่หลายเมืองใช้รับคำขอบริการ หรือ 'codeforamerica/open311dashboard' สำหรับแดชบอร์ดอ้างอิง",zh:"可参考 'open311/open311.github.io' 了解众多城市采用的 Open311 服务请求标准，或 'codeforamerica/open311dashboard' 提供参考仪表板。"},tags:["mobile-app","feedback","AI","image-recognition","cross-agency"]},{id:"vienna-citizen-budget",title:"Vienna Citizen Budget",city:"Vienna",country:"Austria",category:"governance",problem:"Municipal budget decisions were opaque, and citizens felt disconnected from how their tax money was spent. Public consultations attracted only a tiny, unrepresentative group of regular attendees.",solution:"Vienna launched a participatory budgeting platform where residents propose neighbourhood projects, discuss ideas publicly, and vote on which projects receive funding. Each district allocates a fixed portion of its capital budget to citizen-chosen projects. The platform uses ranked-choice voting to ensure broad preferences are captured rather than simple majority rule.",impact:"Over 50,000 residents participated in the first cycle, and 120 community-proposed projects were funded across all 23 districts.",techStack:["JavaScript","TypeScript","React","Node.js","PostgreSQL"],difficulty:"intermediate",codeSnippet:`// Participatory budgeting -- ranked-choice voting interface (vanilla JS)
// Allows citizens to drag-rank their top project picks.

const projects = [
  { id: "p1", title: "New playground in Favoriten", cost: 85000 },
  { id: "p2", title: "Protected bike lane on Ringstrasse", cost: 120000 },
  { id: "p3", title: "Community garden in Ottakring", cost: 45000 },
  { id: "p4", title: "Free public Wi-Fi in Stephansplatz", cost: 60000 },
  { id: "p5", title: "Senior centre renovation in Floridsdorf", cost: 95000 },
];

let ranking = [...projects]; // user reorders this list

function renderBallot(container) {
  container.innerHTML = "<h3>Rank these projects (1 = top choice)</h3>";
  const ol = document.createElement("ol");
  ranking.forEach((proj, idx) => {
    const li = document.createElement("li");
    li.draggable = true;
    li.dataset.idx = idx;
    li.textContent = \`\${proj.title} (€\${proj.cost.toLocaleString()})\`;
    li.addEventListener("dragstart", (e) => e.dataTransfer.setData("idx", idx));
    li.addEventListener("dragover", (e) => e.preventDefault());
    li.addEventListener("drop", (e) => {
      const from = parseInt(e.dataTransfer.getData("idx"));
      const to = idx;
      const [moved] = ranking.splice(from, 1);
      ranking.splice(to, 0, moved);
      renderBallot(container);
    });
    ol.appendChild(li);
  });
  container.appendChild(ol);

  const btn = document.createElement("button");
  btn.textContent = "Submit my vote";
  btn.onclick = () => submitVote(ranking.map((p) => p.id));
  container.appendChild(btn);
}

async function submitVote(rankedIds) {
  const res = await fetch("/api/votes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rankedIds, votedAt: new Date().toISOString() }),
  });
  alert(res.ok ? "Vote recorded -- thank you!" : "Error submitting vote.");
}

// Initialise: renderBallot(document.getElementById("ballot"));`,repoHint:{en:"Search for 'DemocracyOS/democracyos' or 'consul/consul' — both are open-source participatory democracy platforms used by dozens of cities worldwide.",th:"ค้นหา 'DemocracyOS/democracyos' หรือ 'consul/consul' — ทั้งสองเป็นแพลตฟอร์มประชาธิปไตยแบบมีส่วนร่วมโอเพนซอร์สที่เมืองหลายสิบแห่งทั่วโลกใช้งาน",zh:"搜索 'DemocracyOS/democracyos' 或 'consul/consul' — 两者均为世界各地数十座城市采用的开源参与式民主平台。"},tags:["democracy","participation","budgeting","voting","transparency"]},{id:"busan-smart-water",title:"Busan Smart Water",city:"Busan",country:"South Korea",category:"sustainability",problem:"Ageing pipe infrastructure led to undetected leaks and contamination events. Manual water-quality sampling happened only weekly, leaving dangerous gaps in monitoring.",solution:"Busan deployed IoT sensors throughout its water distribution network measuring pH, turbidity, chlorine residual, and flow rate in real time. A central platform aggregates readings, detects anomalies using rolling statistics, and pushes instant alerts to operators when values breach safety thresholds. The data also feeds a predictive model for pipe-burst risk.",impact:"Contamination detection time fell from days to under 15 minutes, and proactive pipe maintenance reduced water loss by 22%.",techStack:["Python","pandas","MQTT","InfluxDB","Grafana","IoT sensors"],difficulty:"advanced",codeSnippet:`# IoT water quality monitor -- reads sensor data and triggers alerts.
# Requires: pip install paho-mqtt pandas

import json
import pandas as pd
from datetime import datetime
import paho.mqtt.client as mqtt

# Safety thresholds (WHO / local standards)
THRESHOLDS = {
    "ph": (6.5, 8.5),
    "turbidity_ntu": (0, 4.0),
    "chlorine_mg_l": (0.2, 4.0),
    "flow_rate_l_min": (10, 5000),
}

readings = []  # rolling window of recent readings

def check_alert(sensor_id: str, metric: str, value: float) -> str | None:
    """Return an alert message if the value is outside safe range."""
    lo, hi = THRESHOLDS.get(metric, (None, None))
    if lo is not None and value < lo:
        return f"ALERT [{sensor_id}]: {metric}={value} BELOW minimum {lo}"
    if hi is not None and value > hi:
        return f"ALERT [{sensor_id}]: {metric}={value} ABOVE maximum {hi}"
    return None

def on_message(client, userdata, msg):
    """Process an incoming sensor reading from the water network."""
    data = json.loads(msg.payload)
    sensor_id = data["sensor_id"]
    timestamp = datetime.fromisoformat(data["timestamp"])

    for metric in ["ph", "turbidity_ntu", "chlorine_mg_l", "flow_rate_l_min"]:
        value = data.get(metric)
        if value is None:
            continue
        alert = check_alert(sensor_id, metric, value)
        if alert:
            print(f"  {alert}")
            # In production: send SMS/push notification to operators

    readings.append({**data, "received_at": datetime.now().isoformat()})
    # Keep a 1-hour rolling window for trend analysis
    if len(readings) > 3600:
        readings.pop(0)

    print(f"[{timestamp}] Sensor {sensor_id}  pH={data.get('ph')}  turb={data.get('turbidity_ntu')}")

client = mqtt.Client()
client.on_message = on_message
client.connect("mqtt.water.example", 1883)
client.subscribe("water/sensors/#")
print("Water quality monitor running...")
client.loop_forever()`,repoHint:{en:"Explore 'UCHIC/GWSDAT' for groundwater monitoring, or search 'water-quality-monitoring IoT' on GitHub. InfluxDB + Grafana templates for water utilities are widely shared.",th:"สำรวจ 'UCHIC/GWSDAT' สำหรับการตรวจสอบน้ำใต้ดิน หรือค้นหา 'water-quality-monitoring IoT' บน GitHub เทมเพลต InfluxDB + Grafana สำหรับการประปามีแชร์กันอย่างกว้างขวาง",zh:"探索 'UCHIC/GWSDAT' 用于地下水监测，或在 GitHub 搜索 'water-quality-monitoring IoT'。InfluxDB + Grafana 用于水务的模板也广泛共享。"},tags:["IoT","water","environment","sensors","public-health","anomaly-detection"]},{id:"kigali-clean-city",title:"Kigali Clean City",city:"Kigali",country:"Rwanda",category:"community",problem:"Rapid urbanisation strained waste services, and informal settlements lacked regular cleanup. There was no systematic way to organise or track community-led maintenance.",solution:"Kigali formalised its traditional 'umuganda' community work practice into a digital scheduling system. Each neighbourhood cell registers volunteers, assigns monthly cleanup zones, and logs completed activities. Cell leaders can report issues via SMS, and the city dashboard shows cleanliness scores per district, creating healthy inter-neighbourhood competition.",impact:"Kigali is now consistently ranked as the cleanest city in Africa, with over 90% resident participation in monthly community cleanup events.",techStack:["Python","SQLite","SMS gateway","Flask"],difficulty:"starter",codeSnippet:`# Community cleanup rotation scheduler
# Assigns volunteer groups to zones on a fair rotation basis.
# Requires: Python 3.10+

from dataclasses import dataclass
from datetime import date, timedelta
from itertools import cycle

@dataclass
class Zone:
    id: str
    name: str
    area_km2: float

@dataclass
class VolunteerGroup:
    id: str
    name: str
    members: int

def generate_rotation(
    groups: list[VolunteerGroup],
    zones: list[Zone],
    start_date: date,
    weeks: int = 12,
) -> list[dict]:
    """Create a fair rotation schedule for community cleanups."""
    schedule = []
    zone_cycle = cycle(zones)

    for week in range(weeks):
        cleanup_date = start_date + timedelta(weeks=week)
        for group in groups:
            zone = next(zone_cycle)
            schedule.append({
                "date": cleanup_date.isoformat(),
                "group": group.name,
                "members": group.members,
                "zone": zone.name,
                "area_km2": zone.area_km2,
            })
    return schedule

# Example
groups = [
    VolunteerGroup("g1", "Nyamirambo Youth", 45),
    VolunteerGroup("g2", "Kicukiro Elders", 30),
    VolunteerGroup("g3", "Gasabo Women's Coop", 38),
]
zones = [
    Zone("z1", "Market Road", 0.4),
    Zone("z2", "Riverside Path", 0.6),
    Zone("z3", "School District", 0.3),
]

schedule = generate_rotation(groups, zones, date.today(), weeks=8)
for entry in schedule[:6]:  # preview first 6 assignments
    print(f"  {entry['date']}  {entry['group']:>25s}  ->  {entry['zone']}")`,repoHint:{en:"Search for 'codeforafrica/sensors.AFRICA' for community-driven environmental monitoring, or 'ushahidi/platform' for community reporting and accountability tools.",th:"ค้นหา 'codeforafrica/sensors.AFRICA' สำหรับการตรวจสอบสิ่งแวดล้อมโดยชุมชน หรือ 'ushahidi/platform' สำหรับเครื่องมือรายงานและความรับผิดชอบระดับชุมชน",zh:"搜索 'codeforafrica/sensors.AFRICA' 了解社区驱动的环境监测，或 'ushahidi/platform' 用于社区报告与问责工具。"},tags:["community","volunteer","scheduling","accountability","SMS"]},{id:"fukuoka-startup-visa",title:"Fukuoka Startup Visa",city:"Fukuoka",country:"Japan",category:"governance",problem:"Japan's traditional business visa process required founders to already have office space, capital, and employees before applying -- a chicken-and-egg problem that deterred foreign entrepreneurs.",solution:"Fukuoka created a special six-month startup visa with a streamlined digital application. The form uses progressive validation -- checking business plan viability, identity documents, and financial thresholds in stages rather than requiring everything upfront. An automated scoring system pre-screens applications, reducing review time from months to weeks.",impact:"Over 200 foreign startups established in Fukuoka since launch, contributing to a 30% growth in the city's startup ecosystem.",techStack:["TypeScript","React","Zod","Node.js","PostgreSQL"],difficulty:"starter",codeSnippet:`// Multi-step visa application form validator using Zod (TypeScript)
// Validates each stage progressively before allowing the applicant to proceed.
// Requires: npm install zod

import { z } from "zod";

// Stage 1: Personal information
const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  nationality: z.string().min(2, "Nationality is required"),
  email: z.string().email("Valid email required"),
  passportNumber: z.string().regex(/^[A-Z0-9]{6,12}$/, "Invalid passport format"),
  dateOfBirth: z.string().refine(
    (d) => new Date(d) < new Date(),
    "Date of birth must be in the past"
  ),
});

// Stage 2: Business plan
const businessPlanSchema = z.object({
  companyName: z.string().min(1, "Company name required"),
  industry: z.enum(["tech", "biotech", "fintech", "cleantech", "creative", "other"]),
  summary: z.string().min(100, "Business summary must be at least 100 characters"),
  projectedRevenue12m: z.number().positive("Revenue projection must be positive"),
  capitalAvailable: z.number().min(5000, "Minimum capital requirement is 5,000 USD"),
});

// Stage 3: Supporting documents
const documentsSchema = z.object({
  passportScanUrl: z.string().url("Valid URL required for passport scan"),
  businessPlanPdfUrl: z.string().url("Valid URL required for business plan PDF"),
  bankStatementUrl: z.string().url("Valid URL required for bank statement"),
});

// Full application is all stages combined
const fullApplicationSchema = personalInfoSchema
  .merge(businessPlanSchema)
  .merge(documentsSchema);

// Validate a single stage and return errors or success
function validateStage(stage: number, data: unknown) {
  const schemas = [personalInfoSchema, businessPlanSchema, documentsSchema];
  const result = schemas[stage].safeParse(data);
  return result.success
    ? { valid: true, data: result.data }
    : { valid: false, errors: result.error.flatten().fieldErrors };
}

// Example usage:
// const step1 = validateStage(0, { fullName: "Tanaka Yuki", ... });
// if (step1.valid) proceedToStage(1);`,repoHint:{en:"Look at 'colinhacks/zod' for the validation library, or search 'multi-step-form react zod' on GitHub for full implementations with React Hook Form integration.",th:"ดู 'colinhacks/zod' สำหรับไลบรารี validation หรือค้นหา 'multi-step-form react zod' บน GitHub สำหรับการใช้งานเต็มรูปแบบร่วมกับ React Hook Form",zh:"可参考 'colinhacks/zod' 验证库，或在 GitHub 搜索 'multi-step-form react zod' 获取与 React Hook Form 集成的完整实现。"},tags:["immigration","digital-government","forms","validation","startups"]},{id:"bangkok-health-station",title:"Bangkok Health Station",city:"Bangkok",country:"Thailand",category:"health",problem:"Bangkok's PM2.5 levels regularly exceed safe limits during the dry season, but residents lacked localised, real-time health guidance beyond generic city-wide warnings.",solution:"The city deployed a network of low-cost air quality sensors across all 50 districts, feeding data to a public API. A companion app and web dashboard show hyper-local PM2.5 readings and generate personalised health advisories based on age, pre-existing conditions, and activity level. Schools and hospitals receive automated alerts when their district crosses hazardous thresholds.",impact:"Respiratory emergency admissions dropped 15% in districts with active sensor coverage, attributed to residents proactively reducing outdoor exposure on high-pollution days.",techStack:["Python","requests","OpenAQ API","pandas","FastAPI"],difficulty:"starter",codeSnippet:`# Air quality monitor -- fetches PM2.5 data from OpenAQ and generates
# health advisories based on WHO breakpoints.
# Requires: pip install requests

import requests
from datetime import datetime

# WHO PM2.5 breakpoints (24-hour mean, ug/m3)
AQI_LEVELS = [
    (0, 15, "Good", "Air quality is satisfactory. Enjoy outdoor activities."),
    (15.1, 35, "Moderate", "Sensitive groups should limit prolonged outdoor exertion."),
    (35.1, 75, "Unhealthy for sensitive groups", "Children, elderly, and those with respiratory conditions should stay indoors."),
    (75.1, 150, "Unhealthy", "Everyone should reduce outdoor activities. Wear N95 masks if going outside."),
    (150.1, 999, "Hazardous", "STAY INDOORS. Close windows. Run air purifiers. Seek medical attention if symptomatic."),
]

def get_pm25(city: str = "Bangkok", limit: int = 5) -> list[dict]:
    """Fetch latest PM2.5 readings from OpenAQ v3 API."""
    url = "https://api.openaq.org/v3/locations"
    params = {
        "city": city,
        "parameter": "pm25",
        "limit": limit,
        "sort": "desc",
        "order_by": "lastUpdated",
    }
    resp = requests.get(url, params=params, timeout=10)
    resp.raise_for_status()
    results = resp.json().get("results", [])
    return [
        {
            "location": r["name"],
            "pm25": r["parameters"][0]["lastValue"] if r.get("parameters") else None,
            "updated": r.get("datetimeLast", {}).get("local", "unknown"),
        }
        for r in results
        if r.get("parameters")
    ]

def health_advisory(pm25_value: float) -> str:
    """Return a health advisory string for a given PM2.5 level."""
    for lo, hi, level, advice in AQI_LEVELS:
        if lo <= pm25_value <= hi:
            return f"[{level.upper()}] PM2.5 = {pm25_value} ug/m3 -- {advice}"
    return f"PM2.5 = {pm25_value} ug/m3 -- level unknown, exercise caution."

if __name__ == "__main__":
    print(f"Bangkok air quality check -- {datetime.now():%Y-%m-%d %H:%M}")
    print("-" * 60)
    stations = get_pm25("Bangkok", limit=5)
    for s in stations:
        if s["pm25"] is not None:
            print(f"  {s['location']}")
            print(f"    {health_advisory(s['pm25'])}")
            print()
    if not stations:
        print("  No stations returned. Check API key or city name.")`,repoHint:{en:"See 'openaq/openaq-api' for the open air quality API, or 'breathe-free/breathe' for community air quality dashboards. Also search 'purple-air open-source' for sensor firmware.",th:"ดู 'openaq/openaq-api' สำหรับ API คุณภาพอากาศแบบเปิด หรือ 'breathe-free/breathe' สำหรับแดชบอร์ดคุณภาพอากาศของชุมชน ยังค้นหา 'purple-air open-source' สำหรับเฟิร์มแวร์เซ็นเซอร์ได้",zh:"参考 'openaq/openaq-api' 开放空气质量 API，或 'breathe-free/breathe' 社区空气质量仪表板。亦可搜索 'purple-air open-source' 获取传感器固件。"},tags:["air-quality","PM2.5","health","sensors","public-api","advisories"]}],h=[{value:"citizen-reporting",labels:{en:"Citizen Reporting",th:"การแจ้งเหตุโดยพลเมือง",zh:"市民举报"}},{value:"smart-infrastructure",labels:{en:"Smart Infrastructure",th:"โครงสร้างพื้นฐานอัจฉริยะ",zh:"智慧基础设施"}},{value:"civic-ai",labels:{en:"Civic AI",th:"AI เพื่อพลเมือง",zh:"公共 AI"}},{value:"mobility",labels:{en:"Mobility",th:"การเดินทาง",zh:"交通出行"}},{value:"sustainability",labels:{en:"Sustainability",th:"ความยั่งยืน",zh:"可持续性"}},{value:"community",labels:{en:"Community",th:"ชุมชน",zh:"社区"}},{value:"governance",labels:{en:"Governance",th:"ธรรมาภิบาล",zh:"治理"}},{value:"health",labels:{en:"Health",th:"สุขภาพ",zh:"健康"}}],v={starter:"var(--accent-green)",intermediate:"var(--accent-amber)",advanced:"var(--accent-red)"},g={en:{title:"Steal This Idea",intro:"Real city innovations with working code you can copy, adapt, and deploy. Each idea comes from a real programme in a real city. The code snippets are starter templates you can drop into a no-code platform or build on directly.",category:"Category",difficulty:"Difficulty",all:"All",starter:"Starter",intermediate:"Intermediate",advanced:"Advanced",countSuffix:"ideas",sectionHeading:"Copy, adapt, deploy",sectionSummary:"Click any card to reveal the working code snippet. Copy it directly or use it as a starting point.",problem:"Problem",solution:"Solution",impact:"Impact",showCode:"Show code",hideCode:"Hide code",starterCode:"Starter code",copyCode:"Copy code",copied:"Copied!",categoryAria:"Idea category filter",difficultyAria:"Idea difficulty filter",stackLabel:"Stack",tagsLabel:"Tags"},th:{title:"ขโมยไอเดียนี้ไปใช้",intro:"นวัตกรรมเมืองจริงพร้อมโค้ดที่ใช้ได้จริง คัดลอก ปรับแก้ และนำไปใช้งานได้ทันที ทุกไอเดียมาจากโครงการจริงในเมืองจริง โค้ดที่ให้เป็นเทมเพลตเริ่มต้นที่นำไปใส่ในแพลตฟอร์ม no-code หรือพัฒนาต่อยอดได้โดยตรง",category:"หมวดหมู่",difficulty:"ระดับความยาก",all:"ทั้งหมด",starter:"เริ่มต้น",intermediate:"ปานกลาง",advanced:"ขั้นสูง",countSuffix:"ไอเดีย",sectionHeading:"คัดลอก ปรับแก้ นำไปใช้",sectionSummary:"คลิกที่การ์ดใดก็ได้เพื่อดูโค้ดที่ใช้งานได้จริง คัดลอกไปใช้ทันทีหรือใช้เป็นจุดเริ่มต้น",problem:"ปัญหา",solution:"ทางออก",impact:"ผลลัพธ์",showCode:"แสดงโค้ด",hideCode:"ซ่อนโค้ด",starterCode:"โค้ดเริ่มต้น",copyCode:"คัดลอกโค้ด",copied:"คัดลอกแล้ว!",categoryAria:"ตัวกรองหมวดหมู่ไอเดีย",difficultyAria:"ตัวกรองระดับความยาก",stackLabel:"ชุดเทคโนโลยี",tagsLabel:"แท็ก"},zh:{title:"拿去用吧",intro:"真实城市的创新案例，附带可复制、修改、部署的代码。每个想法都来自真实城市的真实项目。代码片段是起始模板，可直接放入 no-code 平台或在此基础上继续开发。",category:"类别",difficulty:"难度",all:"全部",starter:"入门",intermediate:"中级",advanced:"高级",countSuffix:"个想法",sectionHeading:"复制、修改、部署",sectionSummary:"点击任意卡片查看可用代码片段。直接复制或作为起点进行开发。",problem:"问题",solution:"方案",impact:"影响",showCode:"显示代码",hideCode:"隐藏代码",starterCode:"起始代码",copyCode:"复制代码",copied:"已复制！",categoryAria:"想法类别筛选",difficultyAria:"想法难度筛选",stackLabel:"技术栈",tagsLabel:"标签"}},k={en:{starter:"Starter",intermediate:"Intermediate",advanced:"Advanced"},th:{starter:"เริ่มต้น",intermediate:"ปานกลาง",advanced:"ขั้นสูง"},zh:{starter:"入门",intermediate:"中级",advanced:"高级"}};function S({text:u,locale:o}){const[n,c]=p.useState(!1),i=g[o];function s(){navigator.clipboard.writeText(u).then(()=>{c(!0),setTimeout(()=>c(!1),2e3)})}return e.jsx("button",{type:"button",className:"idea-copy-btn",onClick:s,children:n?i.copied:i.copyCode})}function _({onNavigate:u,locale:o}){const[n,c]=p.useState("all"),[i,s]=p.useState("all"),[d,f]=p.useState(null),a=g[o],m=p.useMemo(()=>{let t=[...b];return n!=="all"&&(t=t.filter(l=>l.category===n)),i!=="all"&&(t=t.filter(l=>l.difficulty===i)),t},[n,i]);return e.jsxs(e.Fragment,{children:[e.jsx("header",{className:"rankings-hero section",children:e.jsxs("div",{className:"rankings-hero-grid",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"rankings-title",children:a.title}),e.jsx("p",{className:"hero-intro",children:a.intro})]}),e.jsxs("div",{className:"rankings-controls",children:[e.jsxs("div",{className:"rankings-filter-group",children:[e.jsx("p",{className:"panel-label",children:a.category}),e.jsxs("div",{className:"region-switch",role:"group","aria-label":a.categoryAria,children:[e.jsx("button",{type:"button",className:n==="all"?"region-button active":"region-button",onClick:()=>c("all"),children:a.all}),h.map(t=>e.jsx("button",{type:"button",className:n===t.value?"region-button active":"region-button",onClick:()=>c(t.value),children:t.labels[o]},t.value))]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"panel-label",children:a.difficulty}),e.jsxs("div",{className:"mode-switch",role:"group","aria-label":a.difficultyAria,children:[e.jsx("button",{type:"button",className:i==="all"?"mode-button active":"mode-button",onClick:()=>s("all"),children:a.all}),e.jsx("button",{type:"button",className:i==="starter"?"mode-button active":"mode-button",onClick:()=>s("starter"),children:a.starter}),e.jsx("button",{type:"button",className:i==="intermediate"?"mode-button active":"mode-button",onClick:()=>s("intermediate"),children:a.intermediate}),e.jsx("button",{type:"button",className:i==="advanced"?"mode-button active":"mode-button",onClick:()=>s("advanced"),children:a.advanced})]})]})]})]})}),e.jsx("main",{children:e.jsxs("section",{className:"rankings-top section",children:[e.jsxs("div",{className:"section-heading",children:[e.jsxs("div",{children:[e.jsxs("p",{className:"eyebrow",children:[m.length," ",a.countSuffix]}),e.jsx("h2",{children:a.sectionHeading})]}),e.jsx("p",{className:"section-summary",children:a.sectionSummary})]}),e.jsx("div",{className:"idea-grid",children:m.map(t=>{var l;return e.jsxs("article",{className:"idea-card",children:[e.jsx("div",{className:"idea-card-head",children:e.jsxs("div",{children:[e.jsxs("div",{className:"idea-card-meta",children:[e.jsx("span",{className:"idea-difficulty",style:{color:v[t.difficulty]},children:k[o][t.difficulty]}),e.jsx("span",{className:"idea-category",children:(l=h.find(r=>r.value===t.category))==null?void 0:l.labels[o]})]}),e.jsx("h3",{children:t.title}),e.jsxs("p",{className:"city-location",children:[t.city,", ",t.country]})]})}),e.jsxs("p",{className:"idea-problem",children:[e.jsxs("strong",{children:[a.problem,":"]})," ",t.problem]}),e.jsxs("p",{className:"idea-solution",children:[e.jsxs("strong",{children:[a.solution,":"]})," ",t.solution]}),e.jsxs("p",{className:"idea-impact",children:[e.jsxs("strong",{children:[a.impact,":"]})," ",t.impact]}),e.jsxs("div",{className:"metric-taglist-group",children:[e.jsx("span",{className:"metric-taglist-label",children:a.stackLabel}),e.jsx("div",{className:"metric-taglist",children:t.techStack.map(r=>e.jsx("span",{children:r},r))})]}),e.jsx("button",{type:"button",className:d===t.id?"idea-toggle active":"idea-toggle",onClick:()=>f(d===t.id?null:t.id),"aria-expanded":d===t.id,children:d===t.id?a.hideCode:a.showCode}),d===t.id&&e.jsxs("div",{className:"idea-code-block",children:[e.jsxs("div",{className:"idea-code-header",children:[e.jsx("span",{children:a.starterCode}),e.jsx(S,{text:t.codeSnippet,locale:o})]}),e.jsx("pre",{className:"idea-code",children:e.jsx("code",{children:t.codeSnippet})}),e.jsx("p",{className:"idea-repo-hint",children:t.repoHint[o]})]}),e.jsxs("div",{className:"metric-taglist-group",children:[e.jsx("span",{className:"metric-taglist-label",children:a.tagsLabel}),e.jsx("div",{className:"metric-taglist metric-taglist--secondary",children:t.tags.map(r=>e.jsx("span",{children:r},r))})]})]},t.id)})})]})}),e.jsx(y,{onNavigate:u,locale:o})]})}export{_ as default};
