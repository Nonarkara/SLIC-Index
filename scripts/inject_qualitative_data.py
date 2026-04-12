import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(SCRIPT_DIR, '..', 'src', 'data', 'publishedRankingData.json')

# Handcrafted descriptions for top/key cities
BESPOKE_DATA = {
    "tw-kaohsiung": {
        "economyAndState": "Kaohsiung stands as a masterclass in urban transformation. Traditionally a heavy-industry port, its economy relies on logistics, petrochemicals, and newly booming high-tech manufacturing corridors (including TSMC investments). Unlike Taipei, it is remarkably affordable with moderate living costs that let residents keep what they earn. Safety is excellent, and it is a trailblazer in social equality—housing a highly tolerant community with some of the most pluralistic attitudes in Asia.",
        "funFact": "It was the first city in Asia to actively embrace and legalize same-sex civil partnerships prior to national legalization.",
        "tags": ["Heavy Industry", "Affordable", "Highly Tolerant", "Safe"]
    },
    "tw-taipei": {
        "economyAndState": "Taipei is an economic powerhouse driven by electronics, semiconductor headquarters, and a dense service sector. While it offers world-class capabilities in healthcare and education, its economic success has generated intense pressure; housing burdens are severe and land is scarce. However, the tradeoff is unmatched safety, deep civic pluralism, and incredible day-and-night vitality underpinned by an extensive and reliable transit network.",
        "funFact": "Taipei's 101 skyscraper features a 660-tonne tuned mass damper visible to the public, protecting the building against typhoons and earthquakes.",
        "tags": ["Tech Hub", "Expensive Rent", "Very Safe", "Vibrant Public Life"]
    },
    "th-bangkok": {
        "economyAndState": "As the economic engine of Southeast Asia, Bangkok runs on a massive service sector, manufacturing exports, and global tourism. Living costs vary wildly; it offers incredible affordability for expatriates and nomads, but severe wage-compression issues for local workers. While personal safety is moderate and traffic friction is high due to rapid growth, the city is globally renowned for its extreme tolerance, hospitality, and an organic cultural vitality that few cities can match.",
        "funFact": "Bangkok's full ceremonial name is 168 letters long, making it the longest city name in the world.",
        "tags": ["Tourism & Services", "Highly Tolerant", "Vibrant", "Economic Growth"]
    },
    "jp-tokyo": {
        "economyAndState": "Tokyo is a mega-economy unto itself, excelling in finance, electronics, and automotive industries. It manages its immense size remarkably well, providing spectacular safety and world-leading transit viability. However, the economy is highly demanding—intense work cultures create significant mental strain and less personal freedom. It remains somewhat culturally homogeneous but boasts a hyper-functional, meticulously organized civic society.",
        "funFact": "The Tokyo metropolitan area is the most populous in the world, with over 37 million residents, yet experiences incredibly low crime rates.",
        "tags": ["Finance & Tech", "Exacting Work Culture", "Hyper-Safe", "Functional"]
    },
    "sg-singapore": {
        "economyAndState": "Singapore is a highly managed, ultra-rich city-state functioning as the financial and logistical nexus of Asia. Its economy is extremely dynamic but also very expensive, with sky-high housing costs mitigated only by robust public housing structures for citizens. It offers peerless safety, clean air, and infrastructure. Tolerance is rigorously structured to maintain racial and religious harmony, making it stable but highly regulated.",
        "funFact": "Singapore imports sand and freshwater, heavily relying on advanced desalination technology (NEWater) for survival.",
        "tags": ["Finance", "Expensive", "Ultra-Safe", "Structured Diversity"]
    }
}

def generate_algorithmic_narrative(city):
    name = city.get("displayName", "This city")
    
    # Extract scores and handle None safely
    pressure = city.get("pressureScore") or 0
    viability = city.get("viabilityScore") or 0
    capability = city.get("capabilityScore") or 0
    community = city.get("communityScore") or 0
    creative = city.get("creativeScore") or 0
    
    # Determine narrative paths (Thresholds)
    # Pressure: higher = less pressure (good). Lower = high pressure/expensive (bad)
    if pressure > 65:
        econ_sentence = f"The economy of {name} allows for a comfortable standard of living; it features affordable housing, reasonable living costs, and manageable work hours that leave room for personal life."
        econ_tag = "Affordable Living"
    elif pressure < 35:
        econ_sentence = f"Economically, {name} creates profound pressure on its residents. While opportunities may exist, severe housing burdens, a high cost of living, and intense working cultures define the daily grind."
        econ_tag = "Expensive Lifestyle"
    else:
        econ_sentence = f"The economic climate in {name} is balanced, representing a middle ground where moderate living costs intersect with steady, though standard, market pressures."
        econ_tag = "Moderate Costs"

    # Viability & Safety
    if viability > 70:
        safety_sentence = "It is exceptionally safe with highly functional urban infrastructure, making the daily commute and quality of life quite reliable."
        safe_tag = "Very Safe"
    elif viability < 40:
        safety_sentence = "However, it struggles with urban viability—issues like transit, air quality, or personal safety present active challenges for residents."
        safe_tag = "Viability Challenges"
    else:
        safety_sentence = "Safety and urban infrastructure are reasonable, though standard urban frictions still apply."
        safe_tag = "Standard Safety"

    # Community & Tolerance
    if community > 65:
        comm_sentence = "Crucially, it is characterized by deep tolerance, creating an open and welcoming social fabric where diverse backgrounds can thrive."
        comm_tag = "Highly Tolerant"
    elif community < 35:
        comm_sentence = "Civic life can feel somewhat restricted or homogeneous, with narrower definitions of societal expectation and a less open public square."
        comm_tag = "Traditional Fabric"
    else:
        comm_sentence = "The social fabric maintains an average level of community belonging, functioning smoothly but without exceptional vibrancy."
        comm_tag = "Average Belonging"
        
    paragraph = f"{econ_sentence} {safety_sentence} {comm_sentence}"
    
    return {
        "economyAndState": paragraph,
        "funFact": f"{name} presents a fascinating profile, ranking firmly based on local realities rather than global reputation.",
        "tags": [econ_tag, safe_tag, comm_tag]
    }

def process_city_data():
    if not os.path.exists(DATA_FILE):
        print(f"Error: {DATA_FILE} not found.")
        return

    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cities = data.get("cities", [])
    updated_count = 0

    for city in cities:
        city_id = city.get("cityId", "")
        
        # Check if handcrafted
        if city_id in BESPOKE_DATA:
            city["qualitative"] = BESPOKE_DATA[city_id]
        else:
            # Algorithmic fallback
            city["qualitative"] = generate_algorithmic_narrative(city)
            
        updated_count += 1

    # Save out
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully injected qualitative data into {updated_count} cities.")

if __name__ == "__main__":
    process_city_data()
