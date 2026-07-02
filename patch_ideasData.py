import re

with open('src/ideasData.ts', 'r') as f:
    content = f.read()

# Add the import
if 'import { ideasTranslations }' not in content:
    content = content.replace('import type { Locale } from "./types";', 'import type { Locale } from "./types";\nimport { ideasTranslations } from "./ideasTranslations";')

# Update the interface
content = re.sub(r'  title: string;\n', '  title: Record<Locale, string>;\n', content)
content = re.sub(r'  problem: string;\n', '  problem: Record<Locale, string>;\n', content)
content = re.sub(r'  solution: string;\n', '  solution: Record<Locale, string>;\n', content)
content = re.sub(r'  impact: string;\n', '  impact: Record<Locale, string>;\n', content)

# Function to replace fields for a specific ID
def patch_idea(m):
    id_val = m.group(1)
    block = m.group(2)
    # Replace title
    block = re.sub(r'    title:\s*".*?",\n', f'    title: ideasTranslations["{id_val}"].title,\n', block)
    # Replace problem
    block = re.sub(r'    problem:\s*".*?",\n', f'    problem: ideasTranslations["{id_val}"].problem,\n', block)
    # Replace solution
    block = re.sub(r'    solution:\s*".*?",\n', f'    solution: ideasTranslations["{id_val}"].solution,\n', block)
    # Replace impact
    block = re.sub(r'    impact:\s*".*?",\n', f'    impact: ideasTranslations["{id_val}"].impact,\n', block)
    return f'    id: "{id_val}",\n{block}'

# We need a regex that matches the ID line and then everything up to the techStack line
content = re.sub(r'    id: "(.*?)",\n(.*?    techStack:)', patch_idea, content, flags=re.DOTALL)

with open('src/ideasData.ts', 'w') as f:
    f.write(content)
