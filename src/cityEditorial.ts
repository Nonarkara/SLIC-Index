interface CityPhotoSpec {
  fileName: string;
  credit: string;
  alt: string;
  position?: string;
}

interface CityEditorialSeed {
  heroLine?: string;
  intro?: string;
  photo: CityPhotoSpec;
}

export interface CityEditorialEntry {
  heroLine?: string;
  intro?: string;
  photo: {
    credit: string;
    alt: string;
    position?: string;
    sourceUrl: string;
    imageUrl: string;
  };
}

const COMMONS_IMAGE_WIDTH = 2200;

function encodeCommonsTitle(fileName: string) {
  return encodeURIComponent(fileName.replace(/ /g, "_"));
}

function buildCommonsFilePageUrl(fileName: string) {
  return `https://commons.wikimedia.org/wiki/File:${encodeCommonsTitle(fileName)}`;
}

function buildCommonsImageUrl(fileName: string, width = COMMONS_IMAGE_WIDTH) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeCommonsTitle(fileName)}?width=${width}`;
}

const ALPHA_CITY_EDITORIAL: Record<string, CityEditorialSeed> = {
  "tw-kaohsiung": {
    heroLine: "Port infrastructure, warmer light, less daily strain.",
    intro:
      "Kaohsiung is Taiwan's southern harbor metropolis: a working port city that has spent two decades turning industrial edge into public waterfront, arts infrastructure, and a looser daily rhythm. In SLIC terms it matters because logistics strength, cultural reinvention, warmer climate, and more breathable urban pace now sit in the same frame.",
    photo: {
      fileName: "Cijin kaohsiung skyline.png",
      credit: "Bpp88520",
      alt: "Kaohsiung skyline seen across the harbor from Cijin Island.",
      position: "center 56%",
    },
  },
  "tw-taipei": {
    heroLine: "High capability without metropolitan coldness.",
    intro:
      "Taipei is Taiwan's political, cultural, and knowledge core, dense enough to be efficient but still legible enough to feel humane. SLIC reads it as a city where transit, safety, civility, food culture, and plural everyday life compound rather than cancel each other out.",
    photo: {
      fileName: "2026 Taipei Skyline.jpg",
      credit: "Heeheemalu",
      alt: "Taipei skyline viewed from Elephant Mountain.",
      position: "center 58%",
    },
  },
  "us-raleigh": {
    heroLine: "Triangle growth with more room to stay legible.",
    intro:
      "Raleigh is the capital of North Carolina and the largest city in the Research Triangle, shaped less by spectacle than by universities, research, and steady knowledge-economy growth. SLIC treats it as a low-friction city: ambitious, educated, and metropolitan, but still spacious enough for daily life to remain usable.",
    photo: {
      fileName: "Raleigh Skyline.jpg",
      credit: "Abhiram Juvvadi",
      alt: "Downtown Raleigh skyline seen from Dorothea Dix Park.",
      position: "center 54%",
    },
  },
  "kr-busan": {
    heroLine: "Korea's working waterfront at a more human temperature.",
    intro:
      "Busan is South Korea's main port metropolis after Seoul, with container infrastructure, beaches, hillsides, and film-culture visibility all compressed into one maritime city. In SLIC terms it offers a powerful counter-model to capital-city overload: economic relevance and urban texture without quite the same level of pressure.",
    photo: {
      fileName: "Skyline of Busan Including Gwangan Bridge, Marine City and LCT Skyscrapers.jpg",
      credit: "S h y numis",
      alt: "Busan skyline with Gwangan Bridge, Marine City, and the LCT towers.",
      position: "center 56%",
    },
  },
  "pl-katowice": {
    heroLine: "Post-industrial Poland without the museum treatment.",
    intro:
      "Katowice is the core city of Upper Silesia's polycentric industrial belt, shaped by coal, steel, rail, and the long afterlife of heavy infrastructure. SLIC reads it as a serious working city now remaking itself through services, culture, and regional connectivity, while still keeping a tougher, more affordable urban logic than Western Europe's showcase capitals.",
    photo: {
      fileName: "Panoramic view of Katowice.jpg",
      credit: "Derbrauni",
      alt: "Panoramic view across central Katowice.",
      position: "center 44%",
    },
  },
  "jp-fukuoka": {
    heroLine: "Japan's western gateway with balanced metropolitan scale.",
    intro:
      "Fukuoka is Kyushu's leading city and one of Japan's oldest gateway ports to the Asian mainland, compact enough to feel coherent but large enough to carry real startup, university, and logistics energy. In SLIC terms it is balanced metropolitanism: competent, connected, and fast-moving without becoming punishing.",
    photo: {
      fileName: "Fukuoka Skyline of Seaside Momochi.jpg",
      credit: "Nryate",
      alt: "Fukuoka skyline facing the Seaside Momochi waterfront.",
      position: "center 57%",
    },
  },
  "th-bangkok": {
    heroLine: "Plural, improvised, magnetic, and structurally alive.",
    intro:
      "Bangkok's Alpha placement is the index's worked example in full: pure rank #52, tenth seat in the Alpha tier. Seventeen cities with higher pure scores fail gates Bangkok clears — floor scores, coverage, country caps, editorial exclusions. What SLIC measures that most indices miss: the pressure curve here has not priced out the median resident. The cost of daily life — food, transport, rent, the street-level texture of a working week — remains accessible at Bangkok income levels, even as the city's global visitor pull and connectivity figures rival cities ranked well above it. The index does not reward that story with extra points. It rewards it with a seat.",
    photo: {
      fileName: "Bangkok Skyline from Wat Saket.jpg",
      credit: "Slyronit",
      alt: "Bangkok skyline viewed from Wat Saket.",
      position: "center 46%",
    },
  },
  "fr-lyon": {
    heroLine: "Institutional France in a more usable key.",
    intro:
      "Lyon is France's second great urban pole, sitting between the Rhone and Saone with a mix of industry, research, gastronomy, and dense neighborhood life. SLIC treats it as a city where institutional depth still feels usable: economically serious and culturally thick, but less theatrical and often more livable day to day than the capital.",
    photo: {
      fileName: "Lyon - panorama - panoramio.jpg",
      credit: "Gregorini Demetrio",
      alt: "Panoramic view across Lyon.",
      position: "center 52%",
    },
  },
  "ca-montreal": {
    heroLine: "North America's French metropolis, still porous and cultural.",
    intro:
      "Montreal is the major French-speaking metropolis of North America, built from port history, immigration, universities, festivals, and a civic culture that still feels relatively open-textured. In SLIC terms, culture is not ornament here; it is part of the operating system that makes daily urban life feel social, creative, and worth inhabiting.",
    photo: {
      fileName: "Montreal skyline.jpg",
      credit: "MTLskyline",
      alt: "Montreal skyline from Mount Royal.",
      position: "center 38%",
    },
  },
  "cl-santiago": {
    heroLine: "Capability and concentration under Andean pressure.",
    intro:
      "Santiago is Chile's dominant metropolitan core, with finance, universities, state power, and entrepreneurial energy concentrated in one Andean basin. SLIC reads it as a city of real capability and momentum whose attraction lies in the depth of opportunity it offers before the pressure curve hardens into inequality and strain.",
    photo: {
      fileName: "View of the Santiago skyline from the roof of the Ministry of Foreign Affairs (16689217244).jpg",
      credit: "Maina Kiai",
      alt: "Santiago skyline with the Andes beyond.",
      position: "center 50%",
    },
  },
  "us-pittsburgh": {
    heroLine: "Industrial gravity, remade into a sharper civic machine.",
    intro:
      "Pittsburgh is a post-steel American city that never fully abandoned the disciplines of heavy industry; it redirected them into universities, medicine, robotics, and a more compact civic economy. In SLIC terms it matters because capability here is not abstract prestige but a lived structure of institutions, reinvention, and workable urban scale.",
    photo: {
      fileName: "Pittsburgh skyline.jpg",
      credit: "IanManka",
      alt: "Pittsburgh skyline seen from Mount Washington.",
      position: "center 56%",
    },
  },
  "jp-kobe": {
    heroLine: "Harbor city elegance with mountains still in the frame.",
    intro:
      "Kobe is one of Japan's classic port cities, stretched between mountain slope and harbor edge in a way that keeps the metropolitan form unusually legible. SLIC reads it as a city where trade, design consciousness, and daily calm still hold together without the crushing pressure of the very largest Japanese cores.",
    photo: {
      fileName: "Kobe Skyline & Berge.jpg",
      credit: "Zairon",
      alt: "Kobe skyline with mountains behind the harbor city.",
      position: "center 54%",
    },
  },
  "us-minneapolis": {
    heroLine: "Northern capability with room for real daily life.",
    intro:
      "Minneapolis is the stronger half of the Twin Cities economic engine, built on health systems, corporate depth, university capacity, and a long civic tradition of regional planning. In SLIC terms it is a serious winter city that still manages to feel structurally fairer, more organized, and more livable than many larger American peers.",
    photo: {
      fileName: "Minneapolis Skyline (19165922448).jpg",
      credit: "Tony Webster",
      alt: "Downtown Minneapolis skyline seen from the North Loop.",
      position: "center 55%",
    },
  },
  "il-haifa": {
    heroLine: "Israel's mountain port with a broader social horizon.",
    intro:
      "Haifa is Israel's principal northern port, terraced up Mount Carmel and shaped by industry, research, and one of the country's more visibly mixed urban societies. SLIC reads it as a city where coexistence, infrastructure, and topographic drama make a different proposition from the concentrated pressure of the main central belt.",
    photo: {
      fileName: "Haifa skyline view.jpg",
      credit: "StateofIsrael",
      alt: "Haifa skyline descending toward the bay.",
      position: "center 42%",
    },
  },
  "kr-suwon": {
    heroLine: "Seoul-region power without quite the same compression.",
    intro:
      "Suwon is the capital of Gyeonggi-do and one of the major cities orbiting the Seoul region, carrying electronics, administration, and inherited fortress urbanism in the same geography. In SLIC terms it matters as a metropolitan release valve: high-connectivity Korea with slightly more room, less symbolism, and a more workable everyday tempo.",
    photo: {
      fileName: "Suwon cityscape.jpg",
      credit: "Zubro",
      alt: "Panoramic cityscape of Suwon.",
      position: "center 50%",
    },
  },
  "ca-ottawa": {
    heroLine: "Administrative capital, but calmer than the label suggests.",
    intro:
      "Ottawa is Canada's federal capital, but its daily character is less imperial than procedural: government, research, bilingual institutions, and a river-based urban form that rarely needs to perform itself theatrically. SLIC reads it as a city where public-sector stability and human-scale order still convert into real livability.",
    photo: {
      fileName: "Ottawa skyline 2018.jpg",
      credit: "DXR",
      alt: "Ottawa skyline seen from Gatineau across the river.",
      position: "center 54%",
    },
  },
  "cl-valparaiso": {
    heroLine: "Chile's vertical port of improvisation, memory, and abrasion.",
    intro:
      "Valparaiso is Chile's old Pacific port, famous not because it is tidy but because its hills, lifts, murals, stairs, and maritime edge still make urban life feel textured and specific. SLIC reads it as a city where cultural thickness and lived character remain strong even when the infrastructure story is less polished.",
    photo: {
      fileName: "Valparaíso Skyline (232242693).jpg",
      credit: "Ubc School Of Journalism",
      alt: "Valparaiso's hillside urban fabric overlooking the bay.",
      position: "center 48%",
    },
  },
  "it-milan": {
    heroLine: "Italian productivity with a sharper metropolitan edge.",
    intro:
      "Milan is Italy's financial and business capital, a city where fashion, design, manufacturing inheritance, and European service-sector ambition all compress into one hard-working metropolitan core. In SLIC terms it scores not as romance but as capacity: organized, economically relevant, and still culturally dense enough to matter beyond pure output.",
    photo: {
      fileName: "Milano skyline.JPG",
      credit: "Nicolago",
      alt: "Panoramic skyline of Milan from the Duomo.",
      position: "center 50%",
    },
  },
  "nl-eindhoven": {
    heroLine: "Design and deep-tech in a city that stays functional.",
    intro:
      "Eindhoven is the Netherlands' engineering and design city, built on the long afterlife of Philips, technical education, and a regional innovation economy that punches above its size. SLIC reads it as a city where competence is unusually visible: productive, inventive, and less burdened by big-capital theatricality.",
    photo: {
      fileName: "Eindhovenskyline.jpg",
      credit: "David Eerdmans",
      alt: "Skyline view across Eindhoven.",
      position: "center 52%",
    },
  },
  "at-graz": {
    heroLine: "Austria's second city with less choreography and more ease.",
    intro:
      "Graz is a university city, regional capital, and manufacturing center whose baroque fabric and southern setting give it a softer urban grain than Vienna. In SLIC terms it is one of those places where medium scale works in its favor: enough institutional depth to be serious, not so much size that everyday life becomes over-abstracted.",
    photo: {
      fileName: "Graz, Austria skyline - July 2004.jpg",
      credit: "Diliff",
      alt: "Panoramic skyline of Graz from the Schlossberg.",
      position: "center 52%",
    },
  },
  "pt-braga": {
    heroLine: "Northern Portugal's compact city of continuity and upgrade.",
    intro:
      "Braga is one of Portugal's oldest cities, but it now combines ecclesiastical and historic depth with a younger knowledge-economy and technology profile. SLIC reads it as a city where continuity has not become stagnation; the historic shell still carries an urban life that is modern, connected, and comparatively usable.",
    photo: {
      fileName: "Braga skyline (54191790081).jpg",
      credit: "Sarunas Burdulis",
      alt: "Skyline of Braga seen from above.",
      position: "center 44%",
    },
  },
  "il-tel-aviv": {
    heroLine: "Beach-edge intensity with very little patience for stillness.",
    intro:
      "Tel Aviv is Israel's economic and cultural engine, where startup ambition, nightlife, liberal self-image, and Mediterranean shoreline all feed a city running at permanently elevated speed. SLIC reads it as magnetic and highly capable, but also as a place where intensity is part of both the draw and the cost.",
    photo: {
      fileName: "Tel Aviv Skyline 02.jpg",
      credit: "Ynhockey",
      alt: "Tel Aviv and Ramat Gan skylines viewed from the north.",
      position: "center 50%",
    },
  },
  "us-chicago": {
    heroLine: "Continental-scale America in one vertical frame.",
    intro:
      "Chicago remains the great inland metropolis of the United States: finance, logistics, universities, architecture, rail, and lakefront spectacle all layered into one city with genuine global weight. SLIC reads it as a place of very high capability and cultural force whose challenge is converting that scale into broadly breathable daily life.",
    photo: {
      fileName: "Chicago Skyline (10546216053).jpg",
      credit: "Zellaby",
      alt: "Chicago skyline at dusk.",
      position: "center 50%",
    },
  },
  "pt-porto": {
    heroLine: "Granite, river edge, and a strong enough center to hold.",
    intro:
      "Porto is northern Portugal's main city, built along the Douro in a way that keeps commerce, memory, and rough urban texture in continuous contact. SLIC reads it as a city where beauty is not just postcard value; it is tied to density, walkability, cultural continuity, and a more grounded cost structure than bigger Southern European magnets.",
    photo: {
      fileName: "Porto 2016-17 Porto skyline (34662247350).jpg",
      credit: "Bosc d'Anjou",
      alt: "Porto skyline seen across the Douro River.",
      position: "center 48%",
    },
  },
  "ee-tallinn": {
    heroLine: "A Baltic capital that stays wired and legible.",
    intro:
      "Tallinn is Estonia's capital and digital showcase, but what matters in SLIC terms is not branding alone; it is the way administrative competence, compact scale, and a still-readable historic core reinforce each other. The result is a city that feels technologically modern without losing urban intelligibility.",
    photo: {
      fileName: "Tallinn skyline 2025.jpg",
      credit: "Sander Valdre",
      alt: "Modern skyline of Tallinn.",
      position: "center 48%",
    },
  },
  "pl-torun": {
    heroLine: "Historic Poland at a slower, better-kept urban speed.",
    intro:
      "Torun is one of Poland's great medieval cities, small enough that its historic grain still organizes everyday experience rather than merely surviving as scenery. SLIC reads it as a city where continuity, walkability, and manageable scale remain active assets in the lived structure of the place.",
    photo: {
      fileName: "Old town hall in Torun (8).jpg",
      credit: "Krzysztof Golik",
      alt: "The old town hall and historic core of Torun.",
      position: "center 52%",
    },
  },
  "kr-incheon": {
    heroLine: "Korea's western gateway built on logistics and open horizon.",
    intro:
      "Incheon is South Korea's major western port and airport city, a gateway metropolis whose identity comes from movement, reclamation, logistics, and the national role of connecting Korea outward. In SLIC terms it matters because infrastructure here is not ornamental; it is the city's main grammar and a real source of capability.",
    photo: {
      fileName: "Port of Incheon.jpg",
      credit: "Davidinkorea",
      alt: "View across the Port of Incheon from Freedom Park.",
      position: "center 55%",
    },
  },
  "sg-singapore": {
    heroLine: "The highest Capability score in the dataset. Gamma tier.",
    intro:
      "Singapore scores 94.1 on Capability — the highest in this dataset by a significant margin, and a real reflection of port power, state capacity, transit, and administrative competence operating at near-maximum efficiency. It is Gamma tier. This is not a paradox or a scoring error; it is the index working exactly as intended. Gamma is where a city lands when it fails the Alpha floor: Community 38.8 against a required 40. The 1.2-point gap reflects what the data registers — that extraordinary administrative and economic competence does not automatically translate into the social warmth, civic openness, and everyday looseness the Community pillar measures. SLIC does not argue this is a bad city. It argues that 'extraordinary' and 'the median resident thrives here' are different claims, and both deserve to be said out loud.",
    photo: {
      fileName: "Singapore skyline 2022.jpg",
      credit: "Bruce Poon",
      alt: "Singapore skyline seen from the ArtScience Museum area.",
      position: "center 54%",
    },
  },
  "ch-zurich": {
    heroLine: "Swiss order with global finance hiding in plain sight.",
    intro:
      "Zurich is a city where banking, infrastructure, lakefront calm, and civic discipline all reinforce a sense of uncommon reliability. In SLIC terms it is not only about wealth; it is about how institutional order, mobility, and environmental quality combine into a daily experience that feels unusually low-friction.",
    photo: {
      fileName: "Zurich Skyline.jpg",
      credit: "Schuetze75",
      alt: "Zurich skyline with lake and hills beyond.",
      position: "center 52%",
    },
  },
  "dk-copenhagen": {
    heroLine: "Welfare urbanism made legible at metropolitan scale.",
    intro:
      "Copenhagen is one of the clearest examples of a northern European city where planning, mobility, public space, and welfare-state assumptions still visibly structure everyday life. SLIC reads it as a place where systems coherence is the point: not glamorous in the abstract, but deeply convincing in use.",
    photo: {
      fileName: "A Copenhagen skyline (7592520318).jpg",
      credit: "Karen Mardahl",
      alt: "Copenhagen skyline seen across the water.",
      position: "center 52%",
    },
  },
  "kr-jeju-city": {
    heroLine: "Volcanic Korea at a slower, more elemental pace.",
    intro:
      "Jeju is South Korea's main island province, shaped by volcanic geography, a distinct local culture, and a longstanding role as the country's natural and spiritual counterweight to the mainland's relentless pace. SLIC reads it as a city that earns its Alpha place not through density or output but through a combination of governance at island scale, cultural distinctiveness — the haenyeo diving tradition, the Jeju language, the UNESCO-listed craters — and a daily rhythm that never fully submitted to the Seoul compression model.",
    photo: {
      fileName: "Seongsan Ilchulbong 03.jpg",
      credit: "PANONIAN",
      alt: "Seongsan Ilchulbong sunrise peak rising from the sea, Jeju Island.",
      position: "center 52%",
    },
  },
  "au-perth": {
    heroLine: "Australia's isolated west, built on space and coastal ease.",
    intro:
      "Perth is the most isolated large city on earth by the standard measure — a fact that has shaped both its psychology and its offer. Built on mining-boom capital, Indian Ocean coastline, and an almost impractical abundance of space, Perth has spent the past decade building out university research, technology, and livability infrastructure that no longer needs to apologize for the distance. SLIC reads it as a city where the pressure curve stays genuinely low: warm, spacious, coastal, and now competent enough to matter beyond resource extraction.",
    photo: {
      fileName: "Perth from Kings Park.jpg",
      credit: "eGuide Travel",
      alt: "Perth city centre skyline viewed from Kings Park.",
      position: "center 50%",
    },
  },
  "jp-tokyo": {
    heroLine: "Incomprehensible scale, kept almost entirely coherent.",
    intro:
      "Tokyo is the world's largest metropolitan area by any measure, a city of 37-million-plus that still manages to run on time, stay safe, feed itself extraordinarily well, and distribute a quality of urban experience that smaller cities cannot replicate. SLIC reads it as the definitive case of system competence at extreme scale — where transit, density, safety, and accumulated cultural production compound into something that has no real equivalent. The trade-offs are real: working hours, conformity pressure, and housing cost. But the system that delivers in return is equally without parallel.",
    photo: {
      fileName: "Tokyo skyline seen from Tokyo Skytree.jpg",
      credit: "Ruthsic",
      alt: "Tokyo skyline panorama seen from the Tokyo Skytree observation deck.",
      position: "center 50%",
    },
  },

  // — Photo-only entries (Wikimedia Commons attribution) —
  "sa-khobar": {
    photo: {
      fileName: "Khobar water tower.jpg",
      credit: "Francisco Anzola",
      alt: "Khobar, Saudi Arabia — Wikimedia Commons photograph.",
    },
  },
  "au-sydney": {
    photo: {
      fileName: "Sydney Opera House and Harbour Bridge Dusk (2) 2019-06-21.jpg",
      credit: "Benh LIEU SONG (Flickr)",
      alt: "Sydney, Australia — Wikimedia Commons photograph.",
    },
  },
  "sa-jeddah": {
    photo: {
      fileName: "Jeddah Waterfront 2025 (cropped).jpg",
      credit: "Ali Lajami",
      alt: "Jeddah, Saudi Arabia — Wikimedia Commons photograph.",
    },
  },
  "au-brisbane": {
    photo: {
      fileName: "Brisbane CBD seen from Kangaroo Point, 2024, 01 (2).jpg",
      credit: "Chris Olszewski",
      alt: "Brisbane, Australia — Wikimedia Commons photograph.",
    },
  },
  "at-vienna": {
    photo: {
      fileName: "Schoenbrunn philharmoniker 2012.jpg",
      credit: "Superbass",
      alt: "Vienna, Austria — Wikimedia Commons photograph.",
    },
  },
  "au-melbourne": {
    photo: {
      fileName: "Melbourne skyline sor.jpg",
      credit: "Melbpal",
      alt: "Melbourne, Australia — Wikimedia Commons photograph.",
    },
  },
  "bh-manama": {
    photo: {
      fileName: "Manama, Bahrain Decembre 2014.jpg",
      credit: "Wadiia",
      alt: "Manama, Bahrain — Wikimedia Commons photograph.",
    },
  },
  "au-adelaide": {
    photo: {
      fileName: "Adelaide skyline, December 2022 b.jpg",
      credit: "File:Adelaide skyline, December 2022.jpg: Ardash Muradian from Australia derivative work: Georgfotoart",
      alt: "Adelaide, Australia — Wikimedia Commons photograph.",
    },
  },
  "ca-toronto": {
    photo: {
      fileName: "Toronto Skyline from Snake Island, February 28 2026 (08).jpg",
      credit: "Dillan Payne",
      alt: "Toronto, Canada — Wikimedia Commons photograph.",
    },
  },
  "pr-san-juan": {
    photo: {
      fileName: "2013 Old San Juan 01.JPG",
      credit: "Farragutful",
      alt: "San Juan, Puerto Rico — Wikimedia Commons photograph.",
    },
  },
  "nl-amsterdam": {
    photo: {
      fileName: "Imagen de los canales concéntricos en Ámsterdam.png",
      credit: "Andrés Barrios",
      alt: "Amsterdam, Netherlands — Wikimedia Commons photograph.",
    },
  },
  "cn-tianjin": {
    photo: {
      fileName: "天津天际线202511.jpg",
      credit: "Tyngrwey",
      alt: "Tianjin, China — Wikimedia Commons photograph.",
    },
  },
  "jp-hiroshima": {
    photo: {
      fileName: "Atomic Bomb Dome and Motoyaso River, Hiroshima, Northwest view 20190417 1.jpg",
      credit: "DXR",
      alt: "Hiroshima, Japan — Wikimedia Commons photograph.",
    },
  },
  "fr-paris": {
    photo: {
      fileName: "La Tour Eiffel vue de la Tour Saint-Jacques, Paris août 2014 (2).jpg",
      credit: "Yann Caradec from Paris, France",
      alt: "Paris, France — Wikimedia Commons photograph.",
    },
  },
  "pl-gdansk": {
    photo: {
      fileName: "Calle Dlugie Pobrzeze, Gdansk, Polonia, 2013-05-20, DD 06.jpg",
      credit: "Diego Delso",
      alt: "Gdansk, Poland — Wikimedia Commons photograph.",
    },
  },
  "ca-vancouver": {
    photo: {
      fileName: "Vancouver harbour skyline (44723845851).jpg",
      credit: "dronepicr",
      alt: "Vancouver, Canada — Wikimedia Commons photograph.",
    },
  },
  "sk-bratislava": {
    photo: {
      fileName: "Slovakia bratislava.jpg",
      credit: "Arne Müseler",
      alt: "Bratislava, Slovakia — Wikimedia Commons photograph.",
    },
  },
  "pl-krakow": {
    photo: {
      fileName: "Krakow Rynek Glowny panorama 2.jpg",
      credit: "Andrzej Otrębski",
      alt: "Krakow, Poland — Wikimedia Commons photograph.",
    },
  },
  "th-chiang-mai": {
    photo: {
      fileName: "0020-วัดพระสิงห์วรมหาวิหาร.jpg",
      credit: "Nawit science",
      alt: "Chiang Mai, Thailand — Wikimedia Commons photograph.",
    },
  },
  "mu-port-louis": {
    photo: {
      fileName: "Port Louis Skyline.JPG",
      credit: "Thierry",
      alt: "Port Louis, Mauritius — Wikimedia Commons photograph.",
    },
  },
  "it-bologna": {
    photo: {
      fileName: "Torri di Bologna, Bologna.jpg",
      credit: "Fabio Ciminelli",
      alt: "Bologna, Italy — Wikimedia Commons photograph.",
    },
  },
  "my-kota-kinabalu": {
    photo: {
      fileName: "Panoramic view of Kota Kinabalu City.jpg",
      credit: "FILMR Production",
      alt: "Kota Kinabalu, Malaysia — Wikimedia Commons photograph.",
    },
  },
  "my-kuching": {
    photo: {
      fileName: "Kuching Skyline.jpg",
      credit: "Mike86 at English Wikipedia",
      alt: "Kuching, Malaysia — Wikimedia Commons photograph.",
    },
  },
  "tw-taichung": {
    photo: {
      fileName: "Taichung skyline.png",
      credit: "毛貓大少爺 from Taipei, Taiwan",
      alt: "Taichung, Taiwan — Wikimedia Commons photograph.",
    },
  },
  "my-melaka": {
    photo: {
      fileName: "Melaka View.jpg",
      credit: "Atlasmotor",
      alt: "Melaka, Malaysia — Wikimedia Commons photograph.",
    },
  },
  "my-george-town": {
    photo: {
      fileName: "Skyline of George Town, Penang at night Nov2024-29-17.jpg",
      credit: "HundenvonPenang",
      alt: "George Town, Malaysia — Wikimedia Commons photograph.",
    },
  },
  "jp-sapporo": {
    photo: {
      fileName: "SapporoCity Skylines2020.jpg",
      credit: "Nryate",
      alt: "Sapporo, Japan — Wikimedia Commons photograph.",
    },
  },
  "om-salalah": {
    photo: {
      fileName: "Dunst Oman scan0322 - Burj al Nahda.jpg",
      credit: "Bernhard Dunst",
      alt: "Salalah, Oman — Wikimedia Commons photograph.",
    },
  },
  "ar-cordoba": {
    photo: {
      fileName: "Panorama Nueva Córdoba 2012-02-03.jpg",
      credit: "Cholka Pablo Gautero",
      alt: "Cordoba, Argentina — Wikimedia Commons photograph.",
    },
  },
  "cn-guangzhou": {
    photo: {
      fileName: "Canton Tower 20241027.jpg",
      credit: "Tim Wu",
      alt: "Guangzhou, China — Wikimedia Commons photograph.",
    },
  },
  "ae-abu-dhabi": {
    photo: {
      fileName: "Abu dhabi skylines 2014.jpg",
      credit: "Wadiia",
      alt: "Abu Dhabi, United Arab Emirates — Wikimedia Commons photograph.",
    },
  },
  "hu-budapest": {
    photo: {
      fileName: "View from Gellért Hill to the Danube, Hungary - Budapest (28493220635).jpg",
      credit: "Visions of Domino",
      alt: "Budapest, Hungary — Wikimedia Commons photograph.",
    },
  },
  "uy-montevideo": {
    photo: {
      fileName: "PALACIO LEGISLATIVO 01.JPG",
      credit: "Eduardo Ruggieri",
      alt: "Montevideo, Uruguay — Wikimedia Commons photograph.",
    },
  },
  "cn-hangzhou": {
    photo: {
      fileName: "杭州钱江新城 4 (cropped).jpg",
      credit: "EditQ",
      alt: "Hangzhou, China — Wikimedia Commons photograph.",
    },
  },
  "nz-auckland": {
    photo: {
      fileName: "Auckland skyline - May 2024 (2).jpg",
      credit: "elpinto007",
      alt: "Auckland, New Zealand — Wikimedia Commons photograph.",
    },
  },
  "cn-shenzhen": {
    photo: {
      fileName: "Commercial area of futian to east2020.jpg",
      credit: "Charlie fong",
      alt: "Shenzhen, China — Wikimedia Commons photograph.",
    },
  },
  "nz-christchurch": {
    photo: {
      fileName: "The \"Brill\" Tram 178.New Regent St Christchurch. (11510530335).jpg",
      credit: "Bernard Spragg. NZ from Christchurch, New Zealand",
      alt: "Christchurch, New Zealand — Wikimedia Commons photograph.",
    },
  },
  "om-muscat": {
    photo: {
      fileName: "Al Alam Palace.jpg",
      credit: "Tristan",
      alt: "Muscat, Oman — Wikimedia Commons photograph.",
    },
  },
  "mv-male": {
    photo: {
      fileName: "Malé.jpg",
      credit: "Shahee Ilyas",
      alt: "Male, Maldives — Wikimedia Commons photograph.",
    },
  },
  "cr-san-jose": {
    photo: {
      fileName: "Ciudad de San José.png",
      credit: "Alejandro Álvarez Taborda (Aleat88)",
      alt: "San Jose, Costa Rica — Wikimedia Commons photograph.",
    },
  },
  "ar-buenos-aires": {
    photo: {
      fileName: "Puerto Madero, Buenos Aires (40689219792) (cropped).jpg",
      credit: "Deensel",
      alt: "Buenos Aires, Argentina — Wikimedia Commons photograph.",
    },
  },
  "cn-chongqing": {
    photo: {
      fileName: "Chongqing Nightscape.jpg",
      credit: "Jay Huang",
      alt: "Chongqing, China — Wikimedia Commons photograph.",
    },
  },
  "au-hobart": {
    photo: {
      fileName: "Franklin Wharf 2015 b (cropped).jpg",
      credit: "File:Franklin Wharf 2015.jpg: Michael fromholtz derivative work: Georgfotoart",
      alt: "Hobart, Australia — Wikimedia Commons photograph.",
    },
  },
  "cn-chengdu": {
    photo: {
      fileName: "雪山下的成都市天际线 Chengdu skyline with snow capped mountains.jpg",
      credit: "FISU",
      alt: "Chengdu, China — Wikimedia Commons photograph.",
    },
  },
  "ge-tbilisi": {
    photo: {
      fileName: "View of Tbilisi from Tabori Church 2023-10-08-2.jpg",
      credit: "Alexey Komarov",
      alt: "Tbilisi, Georgia — Wikimedia Commons photograph.",
    },
  },
  "nz-dunedin": {
    photo: {
      fileName: "Dunedin-Nueva Zelanda01.JPG",
      credit: "Diego Delso",
      alt: "Dunedin, New Zealand — Wikimedia Commons photograph.",
    },
  },
  "rw-kigali": {
    photo: {
      fileName: "High Angle View Of Kigali City Street on November 29, 2018. Emmanuel Kwizera.jpg",
      credit: "Emmanuelkwizera",
      alt: "Kigali, Rwanda — Wikimedia Commons photograph.",
    },
  },
  "nz-wellington": {
    photo: {
      fileName: "Seddon Statue in Parliament Grounds.jpg",
      credit: "russellstreet",
      alt: "Wellington, New Zealand — Wikimedia Commons photograph.",
    },
  },
  "ma-casablanca": {
    photo: {
      fileName: "Casa finance city 6 (cropped).jpg",
      credit: "Chah.salah",
      alt: "Casablanca, Morocco — Wikimedia Commons photograph.",
    },
  },
  "cn-shanghai": {
    photo: {
      fileName: "Huangpu Park 20124-Shanghai (32208802494).jpg",
      credit: "xiquinhosilva",
      alt: "Shanghai, China — Wikimedia Commons photograph.",
    },
  },
  "ro-bucharest": {
    photo: {
      fileName: "Bucharest University Square (cropped).jpg",
      credit: "Madalin Pentelie",
      alt: "Bucharest, Romania — Wikimedia Commons photograph.",
    },
  },
  "my-kuala-lumpur": {
    photo: {
      fileName: "Bukit Bintang junction in 2024 2.jpg",
      credit: "Renek78",
      alt: "Kuala Lumpur, Malaysia — Wikimedia Commons photograph.",
    },
  },
  "fi-helsinki": {
    photo: {
      fileName: "Suomenlinna (cropped).jpg",
      credit: "Michal Pise, Michal.Pise",
      alt: "Helsinki, Finland — Wikimedia Commons photograph.",
    },
  },
  "ug-kampala": {
    photo: {
      fileName: "Urban Rising, KAMPALA, Uganda.jpg",
      credit: "Chapelle musa",
      alt: "Kampala, Uganda — Wikimedia Commons photograph.",
    },
  },
  "rs-belgrade": {
    photo: {
      fileName: "Panorama Belgrad.jpg",
      credit: "ZlatanJovanovic",
      alt: "Belgrade, Serbia — Wikimedia Commons photograph.",
    },
  },
  "ec-cuenca": {
    photo: {
      fileName: "Collage Cuenca.png",
      credit: "David C. S.",
      alt: "Cuenca, Ecuador — Wikimedia Commons photograph.",
    },
  },
  "pa-panama-city": {
    photo: {
      fileName: "Panama Papers (148830809).jpeg",
      credit: "Dronepicr",
      alt: "Panama City, Panama — Wikimedia Commons photograph.",
    },
  },
  "br-curitiba": {
    photo: {
      fileName: "Vista aérea de Curitiba.jpg",
      credit: "Rodrigo Fonseca/Câmara Municipal de Curitiba",
      alt: "Curitiba, Brazil — Wikimedia Commons photograph.",
    },
  },
  "sa-riyadh": {
    photo: {
      fileName: "Riyadh Skyline.jpg",
      credit: "B.alotaby",
      alt: "Riyadh, Saudi Arabia — Wikimedia Commons photograph.",
    },
  },
  "co-medellin": {
    photo: {
      fileName: "El Poblado Medellín.jpg",
      credit: "Daniel-1-1",
      alt: "Medellin, Colombia — Wikimedia Commons photograph.",
    },
  },
  "py-asuncion": {
    photo: {
      fileName: "Palacio de Gobierno2.jpg",
      credit: "Robert Servin",
      alt: "Asuncion, Paraguay — Wikimedia Commons photograph.",
    },
  },
  "ma-rabat": {
    photo: {
      fileName: "Morocco - Rabat (31387775324).jpg",
      credit: "Visions of Domino",
      alt: "Rabat, Morocco — Wikimedia Commons photograph.",
    },
  },
  "es-valencia": {
    photo: {
      fileName: "Malvarrosa Beach, Valencia, Spain (29812271043).jpg",
      credit: "Boris Dzhingarov",
      alt: "Valencia, Spain — Wikimedia Commons photograph.",
    },
  },
  "th-hat-yai": {
    photo: {
      fileName: "May 2025 - Hat Yai City Skyline view from Khao Kho Hong viewpoint.jpg",
      credit: "TomMumuPangPangEmma",
      alt: "Hat Yai, Thailand — Wikimedia Commons photograph.",
    },
  },
  "vn-da-nang": {
    photo: {
      fileName: "Dragon Bridge, Da Nang during day - 20230819 (cropped).jpg",
      credit: "Somerset999",
      alt: "Da Nang, Vietnam — Wikimedia Commons photograph.",
    },
  },
  "ru-nizhny-novgorod": {
    photo: {
      fileName: "Nizhny Novgorod 2025-04-29 Minin and Pozharsky square 01.jpg",
      credit: "AlexTref871",
      alt: "Nizhny Novgorod, Russia — Wikimedia Commons photograph.",
    },
  },
  "th-phuket": {
    photo: {
      fileName: "Phuket Aerial.jpg",
      credit: "Bennypc",
      alt: "Phuket, Thailand — Wikimedia Commons photograph.",
    },
  },
  "br-florianopolis": {
    photo: {
      fileName: "Morro da Cruz, Florianópolis - SC, Brazil - panoramio (cropped).jpg",
      credit: "oscar fava",
      alt: "Florianopolis, Brazil — Wikimedia Commons photograph.",
    },
  },
  "br-sao-paulo": {
    photo: {
      fileName: "Marginal Pinheiros e Jockey Club.jpg",
      credit: "Agent010",
      alt: "Sao Paulo, Brazil — Wikimedia Commons photograph.",
    },
  },
  "jo-amman": {
    photo: {
      fileName: "New Abdali 2024.png",
      credit: "Ramzik1999",
      alt: "Amman, Jordan — Wikimedia Commons photograph.",
    },
  },
  "jo-aqaba": {
    photo: {
      fileName: "AQABA 2.png",
      credit: "Freedom's Falcon",
      alt: "Aqaba, Jordan — Wikimedia Commons photograph.",
    },
  },
  "hr-zagreb": {
    photo: {
      fileName: "Zagreb (29255640143).jpg",
      credit: "Nick Savchenko from Kiev, Ukraine",
      alt: "Zagreb, Croatia — Wikimedia Commons photograph.",
    },
  },
  "kh-phnom-penh": {
    photo: {
      fileName: "Phnom Penh skyline from TK district Dec 2024.jpg",
      credit: "Looppty",
      alt: "Phnom Penh, Cambodia — Wikimedia Commons photograph.",
    },
  },
  "tz-dar-es-salaam": {
    photo: {
      fileName: "St Joseph's Catholic Cathedral (34895613805).jpg",
      credit: "David Stanley from Nanaimo, Canada",
      alt: "Dar es Salaam, Tanzania — Wikimedia Commons photograph.",
    },
  },
  "pe-arequipa": {
    photo: {
      fileName: "In Aerquipa Peru,…Plaza de Armas (8443293545).jpg",
      credit: "Murray Foubister",
      alt: "Arequipa, Peru — Wikimedia Commons photograph.",
    },
  },
  "id-surabaya": {
    photo: {
      fileName: "Central Surabaya view taken from JW Marriott Surabaya.jpg",
      credit: "consigliere ivan",
      alt: "Surabaya, Indonesia — Wikimedia Commons photograph.",
    },
  },
  "co-bogota": {
    photo: {
      fileName: "Bogota, Colombia (36668708290).jpg",
      credit: "Pedro Szekely from Los Angeles, USA",
      alt: "Bogota, Colombia — Wikimedia Commons photograph.",
    },
  },
  "ph-cebu-city": {
    photo: {
      fileName: "Cebu city skyline 2025.jpg",
      credit: "DisRaptor18",
      alt: "Cebu City, Philippines — Wikimedia Commons photograph.",
    },
  },
  "ke-nairobi": {
    photo: {
      fileName: "Nairobi skyline from Gem Hotel.jpg",
      credit: "Daniel Case",
      alt: "Nairobi, Kenya — Wikimedia Commons photograph.",
    },
  },
  "in-pune": {
    photo: {
      fileName: "Pune West skyline - March 2017.jpg",
      credit: "Ujjawal.Gayakwad",
      alt: "Pune, India — Wikimedia Commons photograph.",
    },
  },
  "pe-lima": {
    photo: {
      fileName: "Lima City Hall.jpg",
      credit: "WMrapids",
      alt: "Lima, Peru — Wikimedia Commons photograph.",
    },
  },
  "ph-makati": {
    photo: {
      fileName: "Makati City Lights (Jopet Sy) - Flickr.jpg",
      credit: "jopetsy",
      alt: "Makati, Philippines — Wikimedia Commons photograph.",
    },
  },
  "kw-kuwait-city": {
    photo: {
      fileName: "Kuwait City Skyline 1.jpg",
      credit: "Zairon",
      alt: "Kuwait City, Kuwait — Wikimedia Commons photograph.",
    },
  },
  "ru-moscow": {
    photo: {
      fileName: "Saint Basil's Cathedral and the Red Square.jpg",
      credit: "U.S. Department of State",
      alt: "Moscow, Russia — Wikimedia Commons photograph.",
    },
  },
  "in-hyderabad": {
    photo: {
      fileName: "Downtown hyderabad drone.png",
      credit: "Shredpave",
      alt: "Hyderabad, India — Wikimedia Commons photograph.",
    },
  },
  "mx-guadalajara": {
    photo: {
      fileName: "Panorámica Guadalajara desde edificio Bansi hacia norte (cropped).jpg",
      credit: "Isacdaavid",
      alt: "Guadalajara, Mexico — Wikimedia Commons photograph.",
    },
  },
  "id-jakarta": {
    photo: {
      fileName: "Bundaran Hotel Indonesia (2025).jpg",
      credit: "Medelam",
      alt: "Jakarta, Indonesia — Wikimedia Commons photograph.",
    },
  },
  "bt-thimphu": {
    photo: {
      fileName: "Tashichödzong Thimphu-2008-01-23.jpg",
      credit: "Christopher J. Fynn",
      alt: "Thimphu, Bhutan — Wikimedia Commons photograph.",
    },
  },
  "cz-brno": {
    photo: {
      fileName: "Brno Montage IV.png",
      credit: "Brno-Freiheitsplatz2.jpg: SchiDD Brno_Katedrála_sv._Petra_a_Pavla_(St.Peter_and_St.Paul_Cathedral).jpg: JRodSilva Brno-Lužánky_XIV.jpg: Millenium187 Brno,_Vila_Tugendhat.jpg: Petr1987 Ignis_Brunensis_Grandfinale_2007.jpg: Jiří Nedorost Brno,_BVV,_výhled_z_výškové_budovy_(11.29.22).jpg: Martin Strachoň Hrad_Špilberk,_Brno_04.jpg: Doronenko",
      alt: "Brno, Czechia — Wikimedia Commons photograph.",
    },
  },
  "gh-accra": {
    photo: {
      fileName: "Acca.jpg",
      credit: "Amoat7",
      alt: "Accra, Ghana — Wikimedia Commons photograph.",
    },
  },
  "gh-kumasi": {
    photo: {
      fileName: "Kronum Kumasi 2018-11-08 (130246).jpg",
      credit: "Maven Egote",
      alt: "Kumasi, Ghana — Wikimedia Commons photograph.",
    },
  },
  "eg-alexandria": {
    photo: {
      fileName: "San Stefano Grand Plaza.JPG",
      credit: "TheEgyptian",
      alt: "Alexandria, Egypt — Wikimedia Commons photograph.",
    },
  },
  "in-bengaluru": {
    photo: {
      fileName: "View from Visvesvaraya Industrial and Technological Museum (2025) 02.jpg",
      credit: "Gpkp",
      alt: "Bengaluru, India — Wikimedia Commons photograph.",
    },
  },
  "si-ljubljana": {
    photo: {
      fileName: "Ljubljana Old Town, Slovenia (Old Camera) (33286165680).jpg",
      credit: "Andrew Milligan Sumo",
      alt: "Ljubljana, Slovenia — Wikimedia Commons photograph.",
    },
  },
  "mx-mexico-city": {
    photo: {
      fileName: "Sobrevuelos CDMX HJ2A4913 (25514321687) (cropped).jpg",
      credit: "Gobierno CDMX",
      alt: "Mexico City, Mexico — Wikimedia Commons photograph.",
    },
  },
  "na-windhoek": {
    photo: {
      fileName: "Christ Church in Windhoek, Namibia.jpg",
      credit: "Christoph Strässler",
      alt: "Windhoek, Namibia — Wikimedia Commons photograph.",
    },
  },
  "in-chandigarh": {
    photo: {
      fileName: "Open Hand monument, Chandigarh.jpg",
      credit: "Raakesh Blokhra",
      alt: "Chandigarh, India — Wikimedia Commons photograph.",
    },
  },
  "qa-doha": {
    photo: {
      fileName: "The Pearl Marina in Nov 2013.jpg",
      credit: "Alex Sergeev (www.asergeev.com)",
      alt: "Doha, Qatar — Wikimedia Commons photograph.",
    },
  },
  "do-santo-domingo": {
    photo: {
      fileName: "SantoDomingoedit.JPG",
      credit: "Jose Juan C",
      alt: "Santo Domingo, Dominican Republic — Wikimedia Commons photograph.",
    },
  },
  "lk-kandy": {
    photo: {
      fileName: "SL Kandy asv2020-01 img04 Queens Hotel.jpg",
      credit: "A.Savin",
      alt: "Kandy, Sri Lanka — Wikimedia Commons photograph.",
    },
  },
  "za-cape-town": {
    photo: {
      fileName: "Cape Town (ZA), Table Mountain, Blick auf City Bowl -- 2024 -- 2855.jpg",
      credit: "Dietmar Rabich",
      alt: "Cape Town, South Africa — Wikimedia Commons photograph.",
    },
  },
  "lv-riga": {
    photo: {
      fileName: "Riga (33844464828).jpg",
      credit: "Jorge Franganillo from Barcelona, Spain",
      alt: "Riga, Latvia — Wikimedia Commons photograph.",
    },
  },
  "bd-chattogram": {
    photo: {
      fileName: "Agrabad Commercial Area.jpg",
      credit: "Raihan Rana",
      alt: "Chattogram, Bangladesh — Wikimedia Commons photograph.",
    },
  },
  "bw-gaborone": {
    photo: {
      fileName: "View from I-Tower SE 20200712.jpg",
      credit: "CNJerem",
      alt: "Gaborone, Botswana — Wikimedia Commons photograph.",
    },
  },
  "lk-colombo": {
    photo: {
      fileName: "Colombo city skyline at night.png",
      credit: "Gihanud2001",
      alt: "Colombo, Sri Lanka — Wikimedia Commons photograph.",
    },
  },
  "bd-dhaka": {
    photo: {
      fileName: "Drone view from Kamal Atatürk Avenue.jpg",
      credit: "Sifat777",
      alt: "Dhaka, Bangladesh — Wikimedia Commons photograph.",
    },
  },
  "za-johannesburg": {
    photo: {
      fileName: "Johannesburg skyline 2017.jpg",
      credit: "Mark Hillary",
      alt: "Johannesburg, South Africa — Wikimedia Commons photograph.",
    },
  },
  "fj-suva": {
    photo: {
      fileName: "Suva, Fiji 77.jpg",
      credit: "Maksym Kozlenko",
      alt: "Suva, Fiji — Wikimedia Commons photograph.",
    },
  },
  "np-pokhara": {
    photo: {
      fileName: "Pokhara Valley.jpg",
      credit: "Utsab Raj Giri",
      alt: "Pokhara, Nepal — Wikimedia Commons photograph.",
    },
  },
  "se-gothenburg": {
    photo: {
      fileName: "Göteborg 2503 stitch (28573994096).jpg",
      credit: "Bengt Nyman from Vaxholm, Sweden",
      alt: "Gothenburg, Sweden — Wikimedia Commons photograph.",
    },
  },
  "np-kathmandu": {
    photo: {
      fileName: "Kathmandu-Durbar Square-06-Mahavishnu-Kuh-Vishnu-Pratapamalla-Jagannath-2007-gje.jpg",
      credit: "Gerd Eichmann",
      alt: "Kathmandu, Nepal — Wikimedia Commons photograph.",
    },
  },
  "ie-cork": {
    photo: {
      fileName: "University College Cork - geograph.org.uk - 41771.jpg",
      credit: "raps",
      alt: "Cork, Ireland — Wikimedia Commons photograph.",
    },
  },
  "be-antwerp": {
    photo: {
      fileName: "Amberes; vistas MAS 2.jpg",
      credit: "LBM1948",
      alt: "Antwerp, Belgium — Wikimedia Commons photograph.",
    },
  },
  "sn-dakar": {
    photo: {
      fileName: "Dakar-place-de-l'Indépendance.jpg",
      credit: "Jeemala",
      alt: "Dakar, Senegal — Wikimedia Commons photograph.",
    },
  },
  "pk-karachi": {
    photo: {
      fileName: "Dolmen Towers Karachi.jpg",
      credit: "King Eliot",
      alt: "Karachi, Pakistan — Wikimedia Commons photograph.",
    },
  },
  "pk-lahore": {
    photo: {
      fileName: "Lahore Fort view from Baradari.jpg",
      credit: "Rohaan Bhatti",
      alt: "Lahore, Pakistan — Wikimedia Commons photograph.",
    },
  },
  "pk-islamabad": {
    photo: {
      fileName: "Faisal Mosque, Islamabad III.jpg",
      credit: "Fassifarooq",
      alt: "Islamabad, Pakistan — Wikimedia Commons photograph.",
    },
  },
  "de-munich": {
    photo: {
      fileName: "Stadtbild München.jpg",
      credit: "Thomas Wolf, www.foto-tw.de",
      alt: "Munich, Germany — Wikimedia Commons photograph.",
    },
  },
  "no-bergen": {
    photo: {
      fileName: "Bergen panorama at night - panoramio (1).jpg",
      credit: "TomasEE",
      alt: "Bergen, Norway — Wikimedia Commons photograph.",
    },
  },
  "vu-port-vila": {
    photo: {
      fileName: "Port Vila aerial.jpg",
      credit: "Phillip Capper from Wellington, New Zealand",
      alt: "Port Vila, Vanuatu — Wikimedia Commons photograph.",
    },
  },
  "pg-port-moresby": {
    photo: {
      fileName: "Port Moresby Town2 Mschlauch.jpg",
      credit: "MSchlauch",
      alt: "Port Moresby, Papua New Guinea — Wikimedia Commons photograph.",
    },
  },
  "uk-london": {
    photo: {
      fileName: "London Skyline (125508655).jpeg",
      credit: "Ilya Grigorik",
      alt: "London, United Kingdom — Wikimedia Commons photograph.",
    },
  },
  "us-new-york": {
    photo: {
      fileName: "View of Empire State Building from Rockefeller Center New York City dllu (cropped).jpg",
      credit: "Dllu",
      alt: "New York, United States — Wikimedia Commons photograph.",
    },
  },
  "cz-prague": {
    photo: {
      fileName: "Prague (6365119737).jpg",
      credit: "Moyan Brenn from Italy",
      alt: "Prague, Czechia — Wikimedia Commons photograph.",
    },
  },
  "cn-nanjing": {
    photo: {
      fileName: "Nanjing CBD from City Wall.jpg",
      credit: "xiquinhosilva",
      alt: "Nanjing, China — Wikimedia Commons photograph.",
    },
  },
  "it-venice": {
    photo: {
      fileName: "Venezia aerial view.jpg",
      credit: "kallerna",
      alt: "Venice, Italy — Wikimedia Commons photograph.",
    },
  },
  "ae-dubai": {
    photo: {
      fileName: "Burj Khalifa floor view from west.jpg",
      credit: "Donaldytong",
      alt: "Dubai skyline with Burj Khalifa.",
    },
  },
  "lt-vilnius": {
    photo: {
      fileName: "Vilnius from Gediminas Tower.jpg",
      credit: "Pofka",
      alt: "Vilnius Old Town panorama from Gediminas Tower.",
    },
  },
  "mx-merida": {
    photo: {
      fileName: "Catedral Merida 02.jpg",
      credit: "Diego Delso",
      alt: "Mérida Cathedral on the central plaza.",
    },
  },
  "ws-apia": {
    photo: {
      fileName: "Apia Harbour, Samoa - panoramio.jpg",
      credit: "kismihok",
      alt: "Apia harbour in Samoa.",
    },
  },

};

function hydrateCityEditorial(seed: CityEditorialSeed): CityEditorialEntry {
  return {
    heroLine: seed.heroLine,
    intro: seed.intro,
    photo: {
      credit: seed.photo.credit,
      alt: seed.photo.alt,
      position: seed.photo.position,
      sourceUrl: buildCommonsFilePageUrl(seed.photo.fileName),
      imageUrl: buildCommonsImageUrl(seed.photo.fileName),
    },
  };
}

export function getCityEditorialEntry(cityId: string): CityEditorialEntry | undefined {
  const normalizedId = cityId.trim().toLowerCase();
  const direct = ALPHA_CITY_EDITORIAL[normalizedId];
  if (direct) {
    return hydrateCityEditorial(direct);
  }

  const bareId = normalizedId.replace(/^[a-z]{2}-/, "");
  const aliased = Object.entries(ALPHA_CITY_EDITORIAL).find(([key]) => key.endsWith(`-${bareId}`))?.[1];
  return aliased ? hydrateCityEditorial(aliased) : undefined;
}
