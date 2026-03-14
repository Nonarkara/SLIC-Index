import fs from 'fs';
import path from 'path';

// 1. Update CSV
const csvPath = path.resolve('./src/data/slic_city_universe.csv');
let csvData = fs.readFileSync(csvPath, 'utf-8');

const newCities = `kp-pyongyang,East Asia,provisional,primary,North Korea,"Test case for extreme coercion"
af-kabul,South Asia,provisional,primary,Afghanistan,"Test case for religious violence and lack of civic freedom"
ve-caracas,Latin America,provisional,primary,Venezuela,"Test case for violent crime and economic collapse"
ht-port-au-prince,Latin America,provisional,primary,Haiti,"Test case for severe violence and systemic failure"
sy-damascus,Middle East,provisional,primary,Syria,"High stress, violence, and geopolitical instability"
ng-lagos,Africa,provisional,primary,Nigeria,"High stress, crowding, road safety challenges, but high energy"
cd-kinshasa,Africa,provisional,primary,DR Congo,"High stress, infrastructure challenges"
ru-yakutsk,Southern/Eastern Europe and Eurasia,provisional,secondary,Russia,"Test case for extreme cold"
ru-norilsk,Southern/Eastern Europe and Eurasia,provisional,secondary,Russia,"Test case for extreme cold and high pollution"
gb-london,Western and Northern Europe,provisional,primary,United Kingdom,"Megacity test for expensive housing, high cost of living, high taxes"
us-new-york,North America,provisional,primary,United States,"Megacity test for high cost of living, expensive healthcare, high stress"
us-san-francisco,North America,provisional,primary,United States,"Megacity test for astronomical housing costs and street hygiene challenges"
ch-geneva,Western and Northern Europe,provisional,secondary,Switzerland,"High cost, complacent, retirement home feel"
mc-monaco,Western and Northern Europe,provisional,secondary,Monaco,"Expensive housing, retirement home, less dynamic"
ca-vancouver,North America,provisional,primary,Canada,"High housing costs, often critiqued as flat or sleepy despite livability"
`;

if (!csvData.includes("kp-pyongyang")) {
    csvData += newCities;
    fs.writeFileSync(csvPath, csvData);
}

// 2. Update rankingsData.ts
const tsPath = path.resolve('./src/rankingsData.ts');
let tsData = fs.readFileSync(tsPath, 'utf-8');

// A. Add fields to CityScreenProfile
if (!tsData.includes("hygiene?: number;")) {
  tsData = tsData.replace(
`  crowding: number;
}`,
`  crowding: number;
  hygiene?: number;
  climate?: number;
  roadSafety?: number;
  foodCulture?: number;
  boringIndex?: number;
  flatExperience?: number;
  taxReturn?: number;
  healthcareCost?: number;
  religiousViolence?: number;
  housingPriceIndex?: number;
}`
  );
}

// B. Add new overrides to cityScreenOverrides
const overridesToAdd = `
  pyongyang: { safety: 50, affordability: 30, equality: 20, civicFreedom: 5, ecology: 30, crowding: 50, boringIndex: 90, religiousViolence: 5, taxReturn: 30, flatExperience: 90 },
  kabul: { safety: 10, affordability: 50, equality: 10, civicFreedom: 10, ecology: 30, crowding: 80, religiousViolence: 95, hygiene: 30 },
  caracas: { safety: 10, affordability: 30, equality: 30, civicFreedom: 30, ecology: 40, crowding: 70, roadSafety: 30 },
  "port-au-prince": { safety: 5, affordability: 20, equality: 20, civicFreedom: 30, ecology: 20, crowding: 85, hygiene: 20, roadSafety: 20, religiousViolence: 20 },
  damascus: { safety: 10, affordability: 30, equality: 25, civicFreedom: 15, ecology: 30, crowding: 70, religiousViolence: 70 },
  lagos: { safety: 30, affordability: 60, equality: 30, civicFreedom: 50, ecology: 30, crowding: 95, hygiene: 35, roadSafety: 30 },
  kinshasa: { safety: 25, affordability: 50, equality: 30, civicFreedom: 40, ecology: 30, crowding: 80, hygiene: 30 },
  yakutsk: { safety: 70, affordability: 60, equality: 60, civicFreedom: 30, ecology: 40, crowding: 30, climate: 5, flatExperience: 80, boringIndex: 85 },
  norilsk: { safety: 65, affordability: 55, equality: 60, civicFreedom: 30, ecology: 5, crowding: 20, climate: 5, hygiene: 20, flatExperience: 85, boringIndex: 90 },
  london: { safety: 80, affordability: 15, equality: 60, civicFreedom: 85, ecology: 65, crowding: 85, housingPriceIndex: 95, taxReturn: 60, flatExperience: 40, boringIndex: 40 },
  "new-york": { safety: 70, affordability: 10, equality: 50, civicFreedom: 85, ecology: 55, crowding: 90, housingPriceIndex: 98, healthcareCost: 95, taxReturn: 50 },
  "san-francisco": { safety: 60, affordability: 5, equality: 55, civicFreedom: 88, ecology: 70, crowding: 60, housingPriceIndex: 99, hygiene: 40, roadSafety: 65 },
  geneva: { safety: 95, affordability: 10, equality: 75, civicFreedom: 90, ecology: 85, crowding: 30, boringIndex: 90, flatExperience: 85, housingPriceIndex: 95 },
  monaco: { safety: 98, affordability: 5, equality: 70, civicFreedom: 85, ecology: 80, crowding: 40, boringIndex: 95, flatExperience: 90, housingPriceIndex: 99 },
  vancouver: { safety: 85, affordability: 15, equality: 70, civicFreedom: 90, ecology: 90, crowding: 45, boringIndex: 80, flatExperience: 85, housingPriceIndex: 96 },
`;

if (!tsData.includes("pyongyang: {")) {
  tsData = tsData.replace(
    'const cityScreenOverrides: Record<string, Partial<CityScreenProfile>> = {',
    'const cityScreenOverrides: Record<string, Partial<CityScreenProfile>> = {\n' + overridesToAdd
  );
}

// C. Update screeningPenalty function
const penaltyLogic = `function screeningPenalty(profile: CityScreenProfile, roomToLiveStrength: number): number {
  let penalty = 0;

  if (profile.safety < 55) {
    penalty -= 14;
  } else if (profile.safety < 65) {
    penalty -= 7;
  } else if (profile.safety > 85) {
    penalty += 2;
  }

  if (roomToLiveStrength < 45) {
    penalty -= 12;
  } else if (roomToLiveStrength < 58) {
    penalty -= 6;
  } else if (roomToLiveStrength > 78) {
    penalty += 2;
  }

  if (profile.equality < 45) {
    penalty -= 8;
  } else if (profile.equality < 60) {
    penalty -= 3;
  }

  if (profile.civicFreedom < 40) {
    penalty -= 12;
  } else if (profile.civicFreedom < 55) {
    penalty -= 6;
  } else if (profile.civicFreedom > 80) {
    penalty += 1;
  }

  if (profile.ecology < 45) {
    penalty -= 10;
  } else if (profile.ecology < 58) {
    penalty -= 4;
  } else if (profile.ecology > 82) {
    penalty += 1;
  }

  if (profile.crowding > 78) {
    penalty -= 8;
  } else if (profile.crowding > 68) {
    penalty -= 4;
  } else if (profile.crowding < 46) {
    penalty += 1;
  }

  // Extensively penalize low priority traits
  if ((profile.hygiene ?? 70) < 50) penalty -= 12;
  if ((profile.climate ?? 70) < 40) penalty -= 12; // too cold
  if ((profile.roadSafety ?? 70) < 50) penalty -= 8;
  if ((profile.foodCulture ?? 70) < 50) penalty -= 6;
  if ((profile.boringIndex ?? 50) > 80) penalty -= 12;
  if ((profile.flatExperience ?? 50) > 80) penalty -= 10;
  if ((profile.taxReturn ?? 70) < 50) penalty -= 8;
  if ((profile.healthcareCost ?? 50) > 80) penalty -= 15;
  if ((profile.religiousViolence ?? 10) > 40) penalty -= 20;
  if ((profile.housingPriceIndex ?? 50) > 90) penalty -= 12;

  return penalty;
}`;

// need to replace exactly the old screeningPenalty function.
// Let's rely on standard search
const regex = /function screeningPenalty\(profile: CityScreenProfile, roomToLiveStrength: number\): number \{[\s\S]*?return penalty;\n\}/;
tsData = tsData.replace(regex, penaltyLogic);

// D. Also update screeningTag
const tagLogic = `function screeningTag(profile: CityScreenProfile, roomToLiveStrength: number): string {
  if ((profile.religiousViolence ?? 10) > 40) return "religious violence";
  if ((profile.hygiene ?? 70) < 50) return "unhygienic";
  if ((profile.climate ?? 70) < 40) return "too cold";
  if ((profile.housingPriceIndex ?? 50) > 95) return "unsustainable housing";
  if ((profile.healthcareCost ?? 50) > 85) return "expensive healthcare";
  if ((profile.boringIndex ?? 50) > 85) return "retirement home";
  if ((profile.flatExperience ?? 50) > 85) return "flat experience";
  if ((profile.taxReturn ?? 70) < 50) return "poor tax return";

  if (profile.civicFreedom < 45) {
    return "coercive atmosphere";
  }
  if (profile.safety < 60) {
    return "safety pressure";
  }
  if (profile.ecology < 50) {
    return "pollution stress";
  }
  if (profile.crowding > 74) {
    return "crowding pressure";
  }
  if (roomToLiveStrength < 50) {
    return "cost burden";
  }
  if (profile.equality < 48) {
    return "high inequality";
  }
  if (roomToLiveStrength > 78) {
    return "strong value";
  }
  if (profile.safety > 85) {
    return "high safety";
  }
  return "balanced fit";
}`;

const tagRegex = /function screeningTag\(profile: CityScreenProfile, roomToLiveStrength: number\): string \{[\s\S]*?return "balanced fit";\n\}/;
tsData = tsData.replace(tagRegex, tagLogic);

fs.writeFileSync(tsPath, tsData);

// Compile to test if it's fine
console.log("Updated data successful!");
