import re

with open('src/compareRankingsData.ts', 'r') as f:
    content = f.read()

# Add the import
if 'import { compareTranslations }' not in content:
    content = content.replace('import type { Locale } from "./types";', 'import type { Locale } from "./types";\nimport { compareTranslations } from "./compareRankingsTranslations";')

# Update the interface
content = re.sub(r'  focus: string;\n', '  focus: Record<Locale, string>;\n', content)
content = re.sub(r'    claimedPurpose: string;\n', '    claimedPurpose: Record<Locale, string>;\n', content)
content = re.sub(r'    actualMeasure: string;\n', '    actualMeasure: Record<Locale, string>;\n', content)
content = re.sub(r'    categories: string\[\];\n', '    categories: Record<Locale, string[]>;\n', content)
content = re.sub(r'    dataInputs: string\[\];\n', '    dataInputs: Record<Locale, string[]>;\n', content)
content = re.sub(r'    blindSpots: string\[\];\n', '    blindSpots: Record<Locale, string[]>;\n', content)
content = re.sub(r'    audienceNote: string;\n', '    audienceNote: Record<Locale, string>;\n', content)
content = re.sub(r'    headline: string;\n', '    headline: Record<Locale, string>;\n', content)
content = re.sub(r'    body: string;\n', '    body: Record<Locale, string>;\n', content)


# The objects in INDEX_PROFILES array have ids: eiu, mercer, resonance, monocle, yonsei.
# Replace their literal values with the imported translation object.
# E.g. focus: "...", -> focus: compareTranslations["eiu"].focus,
# It's safest to do this per profile.
profiles = ["eiu", "mercer", "resonance", "monocle", "yonsei"]

def patch_profile(profile_id):
    global content
    
    # regex for `focus`
    content = re.sub(
        rf'(id:\s*"{profile_id}",.*?)(focus:\s*".*?",)',
        rf'\1focus: compareTranslations["{profile_id}"].focus,',
        content, flags=re.DOTALL
    )
    # regex for methodology
    content = re.sub(
        rf'(id:\s*"{profile_id}",.*?methodology:\s*{{).*?(claimedPurpose:\s*".*?",)',
        rf'\1\n      claimedPurpose: compareTranslations["{profile_id}"].methodology.claimedPurpose,',
        content, flags=re.DOTALL
    )
    content = re.sub(
        rf'(id:\s*"{profile_id}",.*?methodology:\s*{{.*?)(actualMeasure:\s*".*?",)',
        rf'\1actualMeasure: compareTranslations["{profile_id}"].methodology.actualMeasure,',
        content, flags=re.DOTALL
    )
    content = re.sub(
        rf'(id:\s*"{profile_id}",.*?methodology:\s*{{.*?)(categories:\s*\[.*?\]\,)',
        rf'\1categories: compareTranslations["{profile_id}"].methodology.categories,',
        content, flags=re.DOTALL
    )
    content = re.sub(
        rf'(id:\s*"{profile_id}",.*?methodology:\s*{{.*?)(dataInputs:\s*\[.*?\]\,)',
        rf'\1dataInputs: compareTranslations["{profile_id}"].methodology.dataInputs,',
        content, flags=re.DOTALL
    )
    content = re.sub(
        rf'(id:\s*"{profile_id}",.*?methodology:\s*{{.*?)(blindSpots:\s*\[.*?\]\,)',
        rf'\1blindSpots: compareTranslations["{profile_id}"].methodology.blindSpots,',
        content, flags=re.DOTALL
    )
    content = re.sub(
        rf'(id:\s*"{profile_id}",.*?methodology:\s*{{.*?)(audienceNote:\s*".*?",)',
        rf'\1audienceNote: compareTranslations["{profile_id}"].methodology.audienceNote,',
        content, flags=re.DOTALL
    )
    # regex for critique
    content = re.sub(
        rf'(id:\s*"{profile_id}",.*?critique:\s*{{).*?(headline:\s*".*?",)',
        rf'\1\n      headline: compareTranslations["{profile_id}"].critique.headline,',
        content, flags=re.DOTALL
    )
    content = re.sub(
        rf'(id:\s*"{profile_id}",.*?critique:\s*{{.*?)(body:\s*".*?",)',
        rf'\1body: compareTranslations["{profile_id}"].critique.body,',
        content, flags=re.DOTALL
    )

for p in profiles:
    patch_profile(p)

with open('src/compareRankingsData.ts', 'w') as f:
    f.write(content)
