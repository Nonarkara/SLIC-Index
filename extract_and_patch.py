import re
import json

with open('src/cityEditorialTranslations.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Find all keys
keys = re.findall(r'^\s+"([a-z]{2}-[a-z\-]+)": \{', text, flags=re.MULTILINE)

with open('src/cityEditorial.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# We only replace cities that have a heroLine (which means they match the regex)
for city in keys:
    # Look for "city-id": {
    #   heroLine: "...",
    #   intro: "...",
    #   photo: {
    # OR
    #   heroLine: cityEditorialTranslations["city-id"].heroLine
    # The previous script successfully replaced the first 10, so let's only replace if it's a string literal.
    
    # We want to match: heroLine: "something", \s* intro: "something" (or multiline string) \s* photo: {
    
    # regex: "city": { ... }
    # Let's find the start index of '"city": {'
    start_str = f'"{city}": {{'
    idx = content.find(start_str)
    if idx == -1:
        continue
        
    # Find the next 'photo: {' after idx
    photo_idx = content.find('photo: {', idx)
    if photo_idx == -1:
        continue
        
    # Extract the block
    block = content[idx:photo_idx]
    
    # If it already has cityEditorialTranslations, skip
    if 'cityEditorialTranslations' in block:
        continue
        
    # If it has heroLine: "..."
    if 'heroLine:' in block and 'intro:' in block:
        # replace the block
        new_block = f'"{city}": {{\n    heroLine: cityEditorialTranslations["{city}"].heroLine,\n    intro: cityEditorialTranslations["{city}"].intro,\n    '
        content = content[:idx] + new_block + content[photo_idx:]

with open('src/cityEditorial.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Patched {len(keys)} cities.")
