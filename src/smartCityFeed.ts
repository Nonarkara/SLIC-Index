export interface SmartCityFeedItem {
  id: string;
  source: string;
  headline: string;
  publishedAt: string;
  url: string;
  topic: string;
  /** Lowercase city name — if set, this article only appears on that city's card. */
  cityKey?: string;
}

export const smartCityFeed: SmartCityFeedItem[] = [
  /* ── March 2026 ── */
  {
    id: "taiwan-smart-city-expo-ai",
    source: "Digitimes",
    headline: "Smart City Summit & Expo broadens scope with AI city pavilion, robotics and virtual power plants",
    publishedAt: "2026-03-11",
    url: "https://www.digitimes.com/news/a20260311PD202/expo-smart-city-summit-robotics-virtual-power-plant-expansion.html",
    topic: "AI for cities",
    cityKey: "taipei",
  },
  {
    id: "raleigh-idc-award",
    source: "City of Raleigh",
    headline: "Raleigh wins 2026 IDC Smart Cities North America Award",
    publishedAt: "2026-03-05",
    url: "https://raleighnc.gov/apps-maps-and-open-data/news/city-wins-2026-idc-smart-cities-north-america-award",
    topic: "Smart governance",
  },
  /* ── February 2026 ── */
  {
    id: "boston-climate-workforce",
    source: "SmartCitiesWorld",
    headline: "Boston continues to build climate-ready workforce",
    publishedAt: "2026-02-20",
    url: "https://www.smartcitiesworld.net/news/boston-continues-to-build-climate-ready-workforce",
    topic: "Workforce",
    cityKey: "boston",
  },
  {
    id: "wef-physical-ai-cities",
    source: "World Economic Forum",
    headline: "Human-centred physical AI will be key to transforming cities",
    publishedAt: "2026-02-18",
    url: "https://www.weforum.org/stories/2026/02/human-centred-physical-ai-transforming-cities/",
    topic: "AI for cities",
  },
  {
    id: "jakarta-green-buildings",
    source: "C40 Cities",
    headline: "Jakarta solidifies climate leadership with new energy and water efficiency in buildings regulations",
    publishedAt: "2026-02-14",
    url: "https://www.c40.org/news/jakarta-climate-leadership-energy-water-efficiency-buildings-regulations-showcase-green-buildings/",
    topic: "Green buildings",
    cityKey: "jakarta",
  },
  {
    id: "scw-summit-2026",
    source: "SmartCitiesWorld",
    headline: "SmartCitiesWorld Summit 2026: connecting climate action, resilience and urban innovation",
    publishedAt: "2026-02-12",
    url: "https://www.smartcitiesworld.net/smart-cities-news/smartcitiesworld-summit-2026-connecting-climate-action-resilience-and-urban-innovation-12532",
    topic: "Climate resilience",
  },
  {
    id: "municipal-pilots",
    source: "SmartCitiesWorld",
    headline: "Municipalities invited to apply for fully funded pilots",
    publishedAt: "2026-02-10",
    url: "https://www.smartcitiesworld.net/news/municipalities-invited-to-apply-for-fully-funded-pilots",
    topic: "Pilots",
  },
  {
    id: "bangkok-canal-smart-transport",
    source: "The Nation Thailand",
    headline: "Bangkok revitalises arterial canals to create seamless smart city transport links",
    publishedAt: "2026-02-06",
    url: "https://www.nationthailand.com/thailand/bangkok/40062728",
    topic: "Mobility",
    cityKey: "bangkok",
  },
  {
    id: "san-diego-electrification",
    source: "SmartCitiesWorld",
    headline: "San Diego approves contract to electrify City buildings",
    publishedAt: "2026-02-03",
    url: "https://www.smartcitiesworld.net/news/san-diego-approves-contract-to-electrify-city-buildings",
    topic: "Clean energy",
    cityKey: "san diego",
  },
  /* ── January 2026 ── */
  {
    id: "wef-integrated-urban-ecosystems",
    source: "World Economic Forum",
    headline: "Why smart cities must become integrated urban ecosystems",
    publishedAt: "2026-01-28",
    url: "https://www.weforum.org/stories/2026/01/smart-cities-integrated-urban-ecosystems/",
    topic: "Urban planning",
  },
  {
    id: "pathways2resilience",
    source: "SmartCitiesWorld",
    headline: "Pathways2Resilience programme names latest cohort of climate-ready regions",
    publishedAt: "2026-01-24",
    url: "https://www.smartcitiesworld.net/news/pathways2resilience-programme-names-latest-cohort-of-climate-ready-regions",
    topic: "Climate resilience",
  },
  {
    id: "seoul-smart-city-prize",
    source: "WeGO",
    headline: "Seoul Smart City Prize 2026 is now open for applications",
    publishedAt: "2026-01-20",
    url: "https://we-gov.org/news-2023/seoul-smart-city-prize-2026-is-now-open-for-applications/",
    topic: "Smart governance",
    cityKey: "seoul",
  },
  {
    id: "quezon-city-green-code",
    source: "C40 Cities",
    headline: "Quezon City accelerates climate action through the enactment of the Green Building Code",
    publishedAt: "2026-01-15",
    url: "https://www.c40.org/news/quezon-city-accelerates-climate-action-through-the-enactment-of-the-green-building-code-and-inclusive-climate-action-training-programme/",
    topic: "Green buildings",
  },
  {
    id: "ai-define-cities-mobility",
    source: "SmartCitiesWorld",
    headline: "How AI will define cities and mobility in 2026",
    publishedAt: "2026-01-10",
    url: "https://www.smartcitiesworld.net/ai-and-machine-learning/how-ai-will-define-cities-and-mobility-in-2026",
    topic: "Mobility AI",
  },
  {
    id: "smart-cities-outlook-2026",
    source: "Smart Cities Dive",
    headline: "The smart cities outlook for 2026: pressure points for city leaders",
    publishedAt: "2026-01-06",
    url: "https://www.smartcitiesdive.com/news/smart-cities-trends-outlook-2026/810932/",
    topic: "Smart governance",
  },
  {
    id: "st-engineering-lusail",
    source: "SmartCitiesWorld",
    headline: "ST Engineering to provide AI-powered smart city platform for Lusail City",
    publishedAt: "2026-01-03",
    url: "https://www.smartcitiesworld.net/ai-and-machine-learning/st-engineering-to-provide-smart-city-platform-for-lusail-city",
    topic: "Digital twins",
  },
  {
    id: "tomorrow-city-expo-usa",
    source: "Tomorrow.City",
    headline: "Tomorrow.City Expo USA 2026 announced for West Palm Beach",
    publishedAt: "2026-02-24",
    url: "https://tomorrowcity.us/",
    topic: "Smart governance",
  },
];
