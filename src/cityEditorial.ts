interface CityPhotoSpec {
  fileName: string;
  credit: string;
  alt: string;
  position?: string;
}

interface CityEditorialSeed {
  heroLine: string;
  intro: string;
  photo: CityPhotoSpec;
}

export interface CityEditorialEntry {
  heroLine: string;
  intro: string;
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
      "Bangkok is Thailand's dominant metropolis, a city where temples, towers, markets, migrant labor, nightlife, bureaucracy, and improvisation operate on the same crowded grid. SLIC reads it not as polished order but as urban capacity: a place whose hospitality, pluralism, experience density, and now genuinely strong Bangkok-metro connectivity keep absorbing very different ways of living. That global pull is not abstract: Mastercard put Bangkok first in 2019, and Euromonitor's arrivals tables put it first again in 2024 and 2025.",
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
      credit: "Commons contributor",
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
    heroLine: "Extreme competence, engineered almost to the point of abstraction.",
    intro:
      "Singapore is one of the world's most efficient urban systems, where port power, state capacity, transit, public order, and global capital operate with almost frightening smoothness. SLIC reads it as a city of extraordinary capability whose strength is undeniable, even as the question remains how much frictionless success should count against spontaneity and looseness.",
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
