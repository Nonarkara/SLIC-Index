# City Photo Sourcing Guide — SLIC Index
# How to find free, legal, high-quality photos for all 163 cities

---

## Photo Requirements

- **Hero image:** 1200x800 minimum, landscape orientation, representative of the city's *lived experience* (not just a skyline)
- **Additional photos:** 2-3 per city showing: transit, housing, public space, or local life
- **Format:** JPG or WebP, optimized to < 200KB per image
- **License:** Unsplash License (free, no attribution required) or Creative Commons (BY or BY-SA)
- **Naming:** `city-[cityId]-[01|02|03].jpg` (e.g., `city-tw-taipei-01.jpg`)

---

## Recommended Sources

### 1. Unsplash (Primary Source)
**License:** Unsplash License (free for commercial use, no attribution required)  
**Search strategy:** Use city name + specific scene type

**Search terms per city:**
```
[city name] street life
[city name] public transport
[city name] night market / local market
[city name] residential neighborhood
[city name] park / public space
[city name] cycling / pedestrian
[city name] housing / apartment
```

**Quality filters:**
- Only use photos with 2,000+ downloads (proven popularity)
- Prefer photos by verified photographers (checkmark badge)
- Avoid overly processed/filtered images (HDR, heavy saturation)
- Avoid photos that look like stock photography (posed people, generic office buildings)

**Good examples:**
- `Taipei street night market` → shows food stalls, people, local prices
- `Bangkok BTS skytrain` → shows transit, daily commute
- `Barcelona superblock` → shows urban planning, pedestrian space
- `Amsterdam cycling bridge` → shows mobility, infrastructure

**Bad examples:**
- `Singapore skyline Marina Bay` → too touristy, doesn't show lived experience
- `Dubai Burj Khalifa` → iconic but tells us nothing about daily life
- `Generic city skyline at sunset` → every city has this; not distinctive

### 2. Wikimedia Commons (Secondary Source)
**License:** Mostly CC-BY-SA (attribution required) or public domain  
**Best for:** Historic city centers, infrastructure, public buildings, transit stations

**Search strategy:**
```
https://commons.wikimedia.org/wiki/Special:Search?search=[city+name]+street
https://commons.wikimedia.org/wiki/Special:Search?search=[city+name]+metro
https://commons.wikimedia.org/wiki/Special:Search?search=[city+name]+market
```

**Quality filters:**
- Minimum 2,000px wide
- Check license carefully (some are CC-BY-SA which requires attribution)
- Prefer photos from "Wiki Loves Monuments" or "Wiki Loves Earth" contests (high quality)
- Avoid photos with watermarks or visible copyright marks

### 3. City Tourism Boards (Tertiary Source)
**License:** Varies — usually free with attribution  
**Best for:** High-quality promotional photos that still show real city life

**How to approach:**
1. Search "[city name] tourism board press images"
2. Look for "Media Kit" or "Press Resources" pages
3. Email the press office with a request: "We are a non-profit city ranking index. May we use your press photos with attribution?"
4. Most tourism boards will say yes for a public-interest project

### 4. Flickr (Creative Commons Filter)
**License:** CC-BY or CC-BY-SA (attribution required)  
**Best for:** Street photography, local life, markets, neighborhoods

**Search strategy:**
```
https://www.flickr.com/search/?license=4%2C5%2C6%2C9%2C10&text=[city+name]+street
```
(license filter 4,5,6,9,10 = Creative Commons)

### 5. Pexels / Pixabay (Backup Source)
**License:** Free for commercial use  
**Best for:** When Unsplash and Commons don't have what you need

**Caution:** Quality is lower than Unsplash. Use only as backup.

---

## Photo Style Guide

### Color Palette
The SLIC Index uses a warm, editorial palette:
- **Background:** #f8f5f0 (warm cream)
- **Text:** #1c1914 (warm black)
- **Accents:** teal (#1a6b5a), amber (#b85c28), rust (#a0382a), blue (#2a5a8c)

**Photo selection criteria:**
- Prefer photos with warm tones (golden hour, street lights, sunset)
- Avoid overly cool/blue photos unless the city is genuinely cold (e.g., Oslo, Montreal)
- Avoid photos with heavy blue-purple gradients (violates the SLIC visual style)
- Photos with people are preferred over empty landscapes

### Composition
- **Hero images:** Wide-angle, showing depth and context. A street scene with foreground, midground, and background.
- **Transit photos:** Show the system in use — people on a train, not an empty platform
- **Housing photos:** Show actual residential buildings, not luxury condos or slums. The middle-class reality.
- **Market photos:** Show prices, transactions, local food. Evidence of affordability.

### What to Avoid
- ❌ Photos of famous landmarks without context (Eiffel Tower, Statue of Liberty)
- ❌ Photos of luxury hotels, resorts, or shopping malls
- ❌ Drone shots of highways (they look impressive but tell us nothing about livability)
- ❌ Photos of protests, disasters, or conflict (unless the city is on the watchlist for that reason)
- ❌ Photos with visible brand logos or advertisements (unless it's a street market)
- ❌ Overly processed photos (HDR, heavy filters, artificial saturation)

---

## Batch Download Workflow

### Step 1: Generate Search List
Create a CSV with all 163 cities and search terms:
```csv
cityId,displayName,country,unsplash_search_1,unsplash_search_2,unsplash_search_3
th-bangkok,Bangkok,Thailand,"Bangkok street life","Bangkok BTS commute","Bangkok night market"
tw-taipei,Taipei,Taiwan,"Taipei street scene","Taipei MRT station","Taipei night market"
jp-osaka,Osaka,Japan,"Osaka street food","Osaka cycling","Osaka residential"
```

### Step 2: Automated Search (with rate limiting)
Use Unsplash API or manual search:
```bash
# Unsplash API (requires free API key)
# Rate limit: 50 requests/hour for demo key

for city in cities:
    for term in city.search_terms:
        curl "https://api.unsplash.com/search/photos?query=$term&per_page=5&orientation=landscape" \
             -H "Authorization: Client-ID YOUR_KEY"
```

### Step 3: Manual Curation
For each city, a human curator should:
1. Review the top 5 Unsplash results
2. Select the best 1 hero + 2-3 supporting photos
3. Verify the license (Unsplash = always free, no attribution)
4. Download and optimize
5. Rename to `city-[cityId]-[01|02|03].jpg`
6. Record photographer credit in a spreadsheet

### Step 4: Optimization
Use `sharp` or `imagemagick` to:
- Resize hero images to 1200x800
- Resize supporting images to 800x600
- Compress to 60-80% quality
- Output as WebP with JPG fallback

```bash
# Using sharp (Node.js)
sharp(input.jpg)
  .resize(1200, 800, { fit: 'cover', position: 'center' })
  .webp({ quality: 80 })
  .toFile('output.webp');
```

### Step 5: Integration
1. Add photo paths to the city's data in `publishedRankingData.json` or a separate photo manifest
2. Update `CityScorecardPage.tsx` to use the new photo paths
3. Add alt text for accessibility (use the city name + scene description)

---

## Photographer Credit Tracking

Even though Unsplash doesn't require attribution, we should maintain a credit log for ethical transparency:

```csv
cityId,photo_number,filename,photographer_name,photographer_username,source_url,download_date
th-bangkok,01,city-th-bangkok-01.webp,John Smith,jsmith,https://unsplash.com/photos/abc123,2026-06-15
th-bangkok,02,city-th-bangkok-02.webp,Jane Doe,jdoe,https://unsplash.com/photos/def456,2026-06-15
```

This log should be stored in the repo as `data/photo-credits.csv`.

---

## Estimated Effort

| Task | Hours | Notes |
|------|-------|-------|
| Generate search list | 2 | Automated from city list |
| Batch Unsplash search | 4 | API + manual review per city |
| Manual curation (163 cities) | 16 | 6 min per city |
| Download and optimization | 4 | Automated with sharp |
| Integration into codebase | 4 | Update components, add alt text |
| **Total** | **30** | **Can be done in 3-4 days** |

---

## Quick-Start: Top 10 Priority Cities

If full coverage is too much, prioritize these 10 cities first (they have the most traffic):

1. **Bangkok** (th-bangkok) — Alpha, most visited city scorecard
2. **Taipei** (tw-taipei) — Alpha #1, high interest
3. **Singapore** (sg-singapore) — Famous Gamma, controversial
4. **Tokyo** (jp-tokyo) — Global reference city
5. **London** (gb-london) — Global reference city
6. **New York** (us-new-york) — Global reference city
7. **Osaka** (jp-osaka) — Alpha, high interest
8. **Copenhagen** (dk-copenhagen) — Alpha,北欧 benchmark
9. **Kuala Lumpur** (my-kuala-lumpur) — Beta, Southeast Asia reference
10. **Seoul** (kr-seoul) — Beta, East Asia reference

For each, find 1 hero + 2 supporting photos. This is a 3-hour task that would dramatically improve the visual impact of the most-viewed pages.

---

*End of Photo Sourcing Guide*
