import fs from 'fs';

let main = fs.readFileSync('src/cityEditorialTranslations.ts', 'utf8');
let part2 = fs.readFileSync('src/cityEditorialTranslationsPart2.ts', 'utf8');
let part3 = fs.readFileSync('src/cityEditorialTranslationsPart3.ts', 'utf8');
let part4 = fs.readFileSync('src/cityEditorialTranslationsPart4.ts', 'utf8');

// remove export const cityEditorialTranslationsPartX: Record<string, CityEditorialTranslation> = {
// and the closing };
function extractBody(content) {
  let start = content.indexOf('{', content.indexOf('export const'));
  let end = content.lastIndexOf('};');
  return content.slice(start + 1, end).trim();
}

let merged = main.replace(/};\s*$/, '') + ',\n  ' + extractBody(part2) + ',\n  ' + extractBody(part3) + ',\n  ' + extractBody(part4) + '\n};\n';

fs.writeFileSync('src/cityEditorialTranslations.ts', merged);

fs.unlinkSync('src/cityEditorialTranslationsPart2.ts');
fs.unlinkSync('src/cityEditorialTranslationsPart3.ts');
fs.unlinkSync('src/cityEditorialTranslationsPart4.ts');

console.log("Merged translations into cityEditorialTranslations.ts");
