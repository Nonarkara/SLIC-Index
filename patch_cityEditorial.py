import re

with open('src/cityEditorial.ts', 'r') as f:
    content = f.read()

# Add the import
if 'import { cityEditorialTranslations }' not in content:
    content = content.replace('interface CityPhotoSpec {', 'import type { Locale } from "./types";\nimport { cityEditorialTranslations } from "./cityEditorialTranslations";\n\ninterface CityPhotoSpec {')

# Update the interfaces
content = re.sub(r'  heroLine\?: string;\n', '  heroLine?: Record<Locale, string>;\n', content)
content = re.sub(r'  intro\?: string;\n', '  intro?: Record<Locale, string>;\n', content)

# Replace city entries
cities = [
    "tw-kaohsiung", "tw-taipei", "us-raleigh", "kr-busan", "pl-katowice",
    "jp-fukuoka", "th-bangkok", "fr-lyon", "ca-montreal", "cl-santiago"
]

for city in cities:
    # Match the heroLine and intro for the city
    pattern = rf'("{city}": {{\s+)heroLine: ".*?",\s+intro:\s+".*?",\s+photo:'
    replacement = rf'\1heroLine: cityEditorialTranslations["{city}"].heroLine,\n    intro: cityEditorialTranslations["{city}"].intro,\n    photo:'
    # Because intro can span multiple lines, we use regex with DOTALL or similar.
    pattern2 = rf'("{city}": {{\s+)heroLine: ".*?",\n\s+intro:.*?\n\s+photo:'
    # Let's write a safer regex
    
    # We can match from '"{city}": {' to 'photo: {'
    city_pattern = rf'("{city}": {{)(.*?)(photo: {{)'
    def replacer(m):
        return m.group(1) + f'\n    heroLine: cityEditorialTranslations["{city}"].heroLine,\n    intro: cityEditorialTranslations["{city}"].intro,\n    ' + m.group(3)
    content = re.sub(city_pattern, replacer, content, flags=re.DOTALL)

with open('src/cityEditorial.ts', 'w') as f:
    f.write(content)
