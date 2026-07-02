import re

with open('src/compareRankingsData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

profiles = ["imd", "mori", "oxford", "hanke", "slic-soft-power", "happy-city"]

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

with open('src/compareRankingsData.ts', 'w', encoding='utf-8') as f:
    f.write(content)
