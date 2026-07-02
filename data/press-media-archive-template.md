# Press Coverage & Media Archive — Template
# Track every mention of SLIC Index in media, conferences, and academic publications

---

## Archive Structure

```
media-archive/
├── press-articles.json       # News articles and interviews
├── conference-talks.json      # Keynotes, panels, workshops
├── academic-citations.json   # Papers that cite or reference SLIC
├── podcasts-interviews.json  # Audio/video appearances
├── social-mentions.json      # Major social media threads
└── press-kit/                # Downloadable assets for journalists
    ├── one-pager-en.pdf
    ├── one-pager-th.pdf
    ├── fact-sheet.pdf
    ├── logo-pack.zip
    └── headshots.zip
```

---

## 1. Press Articles Template

```json
{
  "articles": [
    {
      "id": "article-001",
      "date": "2026-04-15",
      "publication": "Bangkok Post",
      "title": "Thai-built city index challenges global rankings",
      "url": "https://www.bangkokpost.com/...",
      "language": "en",
      "type": "news",
      "excerpt": "A new index developed by Thai researchers is challenging established city rankings by measuring what it actually costs to build a life in a city...",
      "quote": "\"Most city rankings evaluate cities for people who already have the money to live there. We measure for residents.\" — Dr. Non Arkara",
      "tags": ["ranking", "methodology", "Thailand"],
      "reach": "print + online",
      "screenshot": "archive/bangkok-post-2026-04-15.jpg"
    }
  ]
}
```

**Fields explained:**
- `id`: Unique identifier for tracking
- `date`: Publication date (YYYY-MM-DD)
- `publication`: Name of the media outlet
- `title`: Article headline
- `url`: Direct link (if available; may be paywalled)
- `language`: en, th, zh, ko, ja, or other
- `type`: news, op-ed, interview, review, feature, wire-service
- `excerpt`: 1-2 sentence summary
- `quote`: A quotable line from the article about SLIC
- `tags`: Categorization for filtering
- `reach`: print, online, social, broadcast
- `screenshot`: Archive copy (in case link dies)

---

## 2. Conference Talks Template

```json
{
  "talks": [
    {
      "id": "talk-001",
      "date": "2026-03-20",
      "event": "Smart City Summit & Expo",
      "location": "Taipei, Taiwan",
      "venue": "Nangang Exhibition Center",
      "type": "keynote",
      "title": "The City Is Not a Spreadsheet: On the Politics of Urban Measurement",
      "speaker": "Dr. Non Arkara",
      "audience_size": 3000,
      "audience_description": "smart city professionals, mayors, urban planners",
      "duration_minutes": 45,
      "video_url": "https://youtube.com/...",
      "slides_url": "https://slideshare.net/...",
      "recording_available": true,
      "photos": [
        "archive/taipei-2026-01.jpg",
        "archive/taipei-2026-02.jpg"
      ],
      "press_coverage": ["article-001", "article-002"],
      "tags": ["keynote", "methodology", "V2-launch"]
    }
  ]
}
```

**Key events to track:**
- Smart City Summit & Expo Taipei (March 2026)
- GITEX AI Asia Singapore (April 2026)
- LEAP EAST Hong Kong (July 2026 — scheduled)
- Big Tech Asia Kuala Lumpur (2024)
- Any future events (2026-2027)

---

## 3. Academic Citations Template

```json
{
  "citations": [
    {
      "id": "cite-001",
      "date": "2026-05-10",
      "authors": "Chen, W. & Liu, H.",
      "title": "Re-evaluating liveability indices: A capability approach",
      "journal": "Journal of Urban Technology",
      "volume": "33",
      "issue": "2",
      "pages": "145-162",
      "doi": "10.1080/...",
      "url": "https://doi.org/...",
      "citation_context": "SLIC Index (Arkara & Thiengburanathum, 2026) offers a resident-centered alternative to traditional rankings...",
      "citation_count": 1,
      "language": "en",
      "peer_reviewed": true,
      "tags": ["academic", "citation", "methodology"]
    }
  ]
}
```

**How to track:**
1. Set up Google Scholar alerts for: "SLIC Index", "Smart and Liveable Cities Index", "Arkara", "Thiengburanathum"
2. Check ResearchGate, Academia.edu, and Semantic Scholar monthly
3. Ask co-authors and collaborators to forward citations they encounter

---

## 4. Podcasts & Interviews Template

```json
{
  "appearances": [
    {
      "id": "pod-001",
      "date": "2026-05-22",
      "program": "The Urbanist Podcast",
      "episode": "EP-127: Measuring What Matters",
      "host": "Sarah Johnson",
      "guest": "Dr. Non Arkara",
      "platform": "Spotify / Apple Podcasts",
      "duration_minutes": 52,
      "url": "https://open.spotify.com/episode/...",
      "transcript_available": false,
      "topics": ["methodology", "Bangkok", "V3 launch", "data transparency"],
      "quote": "\"A ranking system which cannot see Vienna's suicide rate while awarding it first place is measuring something other than what it claims to measure.\"",
      "tags": ["podcast", "interview", "methodology"]
    }
  ]
}
```

---

## 5. Social Media Highlights Template

Track major threads and viral posts (not every mention):

```json
{
  "social_highlights": [
    {
      "id": "social-001",
      "date": "2026-04-12",
      "platform": "Twitter/X",
      "author": "@urbanist_jane",
      "author_verified": true,
      "author_followers": 45000,
      "content": "This new index from Thailand is the first city ranking I've seen that actually measures what it costs to live somewhere, not just how pretty it looks. Singapore is Gamma tier because the index measures residents, not headquarters. Fascinating.",
      "url": "https://x.com/urbanist_jane/status/...",
      "engagement": {
        "likes": 2340,
        "retweets": 890,
        "replies": 145
      },
      "screenshot": "archive/social-001.jpg",
      "tags": ["viral", "Singapore", "Gamma"]
    }
  ]
}
```

---

## 6. Press Kit Contents

Create a downloadable ZIP for journalists with:

### One-Pager (EN)
- **Headline:** "The SLIC Index: A Resident-Centered City Ranking"
- **Subhead:** "163 cities. 5 pillars. 20 metrics. Zero paid placement."
- **Key facts:**
  - Developed by: Dr. Non Arkara (DEPA) & Assoc. Prof. Poon Thiengburanathum (PMU-A)
  - Published: 2026
  - Cities: 163 ranked + watchlist
  - Languages: English, Thai, Chinese, Korean, Japanese
  - License: Open data, public methodology, free to cite
- **Contact:** [email] [website] [social]
- **Download the full ranking:** [URL]
- **Download the methodology:** [URL]

### One-Pager (TH)
(Same structure, translated)

### Fact Sheet
- **Full name:** Smart and Liveable Cities Index (SLIC)
- **Version:** V3 (2026)
- **Score model:** AMPI (Adaptive Multi-Pillar Index) with 5 pillars
  - Pressure (Growth): 25%
  - Viability (Liveability): 22%
  - Capability (Human capital): 18%
  - Community (Belonging): 15%
  - Creative (Innovation): 20%
- **Data sources:** 20+ metrics from city, national, and composite sources
- **Coverage grades:** A (75%+), B (50-74%), C (35-49%)
- **Public tiers:** Alpha (10), Beta (10), Gamma (10), Watchlist
- **Funding:** DEPA + PMU-A (Thai public sector), no private funding
- **Methodology paper:** [PDF link]
- **Google Sheets template:** [link]

### Logo Pack
- SLIC logo in: SVG, PNG (white, black, color), EPS
- Brand guidelines: colors, fonts, spacing, do's and don'ts

### Headshots
- Dr. Non Arkara: high-res portrait, bio (150 words)
- Assoc. Prof. Poon Thiengburanathum: high-res portrait, bio (150 words)

---

## 7. Integration into the Website

### On the About Page
Add a "Press & Media" section with:
- Latest 3 press articles (with headline, publication, date, link)
- Latest 3 conference talks (with event, date, video link)
- "Download Press Kit" button (ZIP)
- "Media Contact" email

### On the Awards Page
Add a "Media Coverage" subsection showing:
- Total press mentions
- Total conference appearances
- Total academic citations
- Geographic reach of coverage (map or list)

### On the Home Page
Add a "As Seen In" or "In the Press" strip with:
- Logos of 5-8 major publications that have covered SLIC
- Clicking a logo takes you to the article
- This builds instant credibility for new visitors

---

## 8. Maintenance Workflow

**Monthly:**
1. Google News search: "SLIC Index" OR "Smart and Liveable Cities Index"
2. Google Scholar search for citations
3. Check Twitter/X, LinkedIn for mentions
4. Add new entries to the JSON files
5. Archive screenshots of important articles (in case they go behind paywalls)

**Quarterly:**
1. Update the "As Seen In" strip on the homepage with new publications
2. Send press kit to 5 new journalists or urbanist bloggers
3. Write a "Media Roundup" blog post or social thread
4. Review and update press kit contents

**Annually:**
1. Produce a "Year in Review" media report
2. Count total reach, impressions, and geographic spread
3. Identify gaps: which regions haven't covered SLIC yet? Target them.

---

*End of Press & Media Archive Template*
