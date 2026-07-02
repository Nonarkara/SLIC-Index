import json
import re
from bs4 import BeautifulSoup

def parse_scholar_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    soup = BeautifulSoup(html, 'html.parser')
    
    # Titles are in a.gsc_a_at
    titles = soup.find_all('a', class_='gsc_a_at')
    
    results = []
    for t in titles:
        title_text = t.get_text()
        
        # The parent row (tr) has the year usually in the last column
        tr = t.find_parent('tr')
        year = ""
        if tr:
            year_td = tr.find('td', class_='gsc_a_y')
            if year_td:
                year = year_td.get_text()
                
        results.append({"title": title_text, "year": year})

    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    parse_scholar_html("/Users/nonarkara/.gemini/antigravity/brain/56a5ad8e-bb62-434b-b2a0-75ca20b0f68e/.system_generated/steps/440/content.md")
