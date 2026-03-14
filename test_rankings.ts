import fs from 'fs';
import path from 'path';

// Read the CSV file directly instead of the Vite ?raw import
const csvPath = path.resolve('./src/data/slic_city_universe.csv');
const rawCsv = fs.readFileSync(csvPath, 'utf-8');

// Read the rankings file and transform the import
const rankingsPath = path.resolve('./src/rankingsData.ts');
const rankingsCode = fs.readFileSync(rankingsPath, 'utf-8');

// Replace the vite-specific import
const updatedCode = rankingsCode.replace(
  'import cityUniverseCsv from "./data/slic_city_universe.csv?raw";',
  `const cityUniverseCsv = \`${rawCsv}\`;`
);

// Write to a temporary file
const tempPath = path.resolve('./temp_rankingsData.ts');
fs.writeFileSync(tempPath, updatedCode);

// Write our test runner
const testRunner = `
import { getRankingsBoard } from "./temp_rankingsData";

const rankings = getRankingsBoard({ mode: "balanced", region: "All", scope: "field" });
const top10 = rankings.slice(0, 10);

console.log("Top 10 Rankings:");
top10.forEach((city, index) => {
  console.log(\`\${index + 1}. \${city.name} (Score: \${city.scores.balanced}, Delta: \${city.delta}, Community: \${city.scores.community}, GlobalRank: \${city.globalRank})\`);
});

const bangkok = rankings.find(c => c.id === "bangkok");
if (bangkok) {
    const bIndex = rankings.indexOf(bangkok);
    console.log(\`\\nBangkok is at rank: \${bIndex + 1}\`);
}
`;

const runnerPath = path.resolve('./run_test.ts');
fs.writeFileSync(runnerPath, testRunner);
