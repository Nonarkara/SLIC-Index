import re

with open('src/cityEditorial.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern matches:
# "city-id": {
#   heroLine: "...",
#   intro:
#     "...",
#   photo: {
#
# Because string literals can span lines or have escaped characters, we match anything between 'heroLine:' and 'photo: {'
def replacer(m):
    city_id = m.group(1)
    # We reconstruct the object but point to cityEditorialTranslations instead of the raw strings
    return f'"{city_id}": {{\n    heroLine: cityEditorialTranslations["{city_id}"].heroLine,\n    intro: cityEditorialTranslations["{city_id}"].intro,\n    photo: {{'

# Regex explanation:
# "([a-z]{2}-[a-z\-]+)": \{      -> Matches the city key, e.g. "us-pittsburgh": { (capturing the ID)
# \s+heroLine:.*?(?=\s+photo: \{) -> Matches everything starting from heroLine up to just before photo: {
pattern = r'"([a-z]{2}-[a-z\-]+)": \{\s+heroLine:.*?(?=\s+photo: \{)'

new_content = re.sub(pattern, replacer, content, flags=re.DOTALL)

with open('src/cityEditorial.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)
