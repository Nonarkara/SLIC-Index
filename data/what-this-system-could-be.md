# What This System Could Be — SLIC Index V3.5 / V4 Vision
# A roadmap from "award-worthy" to "award-winning"

---

## Executive Summary

The SLIC Index V3 is already a **comprehensive, well-translated, technically rigorous** city ranking system. It has 163 cities, 5 languages, 5 pillars, 20 metrics, and a novel AMPI scoring model. It is better than most existing indices in terms of methodology transparency and data coverage.

But to become **award-winning** — to win a Webby, a Kantar award, or a major design/UX prize — it needs to move from **"a great research tool"** to **"a daily destination for city lovers, policymakers, and researchers."**

This document maps each domain/tab/page from its **current state** to its **potential state**, with specific data and feature requirements.

---

## 1. Home Page (`/`)

### Current State
- Alpha/Beta/Gamma/Watchlist tier display
- Interactive spider chart (ZeroSumAllocator)
- Launch trail with 3 events
- 4 language tiles (not clickable)
- "About the Index" button → About page
- Contact info in hero text

### What It Could Be: "The Daily City Dashboard"
- **Live ticker:** "Today's highest mover: [City] +3.2% in [Pillar]" (simulated or real-time if data allows)
- **Trending cities:** "Most viewed this week: [City]", "Most debated: [City]"
- **Personalized ranking:** "Set your priorities → See your personal Top 10" (the spider chart already does this, but it should be front and center with a "Save my ranking" feature)
- **News feed:** "Latest city news from [City]" (aggregated from local news RSS feeds, or a curated "City Pulse" section)
- **Newsletter signup:** "Get the monthly City Scorecard update" — email capture for re-engagement
- **Social proof:** "As featured in [Bangkok Post], [The Urbanist], [Smart City Summit]" — press logos strip
- **Interactive globe:** A 3D or 2D globe showing all 163 cities with color-coded tiers. Click to fly to city scorecard.

### Data Requirements
- [ ] Visitor analytics (already have `trackVisitor()` but need to aggregate and display trending data)
- [ ] News RSS/API integration for 10-20 major cities (feeds or API)
- [ ] Newsletter service (Mailchimp, Substack, or self-hosted)
- [ ] Press coverage logos (see `press-media-archive-template.md`)
- [ ] Optional: Real-time data feeds for air quality, traffic, etc. (if API access is available)

### Effort: Medium (2-3 weeks)

---

## 2. Rankings Page (`/rankings`)

### Current State
- Interactive weight workbench (5 sliders, 6 presets)
- Table with 163 rows, sortable
- Consequences panel (warning messages)
- Export to CSV
- TTS button
- Coverage legend (hardcoded for EN/TH/ZH)

### What It Could Be: "The City Ranking Laboratory"
- **Save & share custom rankings:** "Share your ranking" → generates a unique URL with the weight parameters encoded in the hash. This is the #1 missing feature for social sharing.
- **Compare mode:** Select 2-5 cities and see a side-by-side spider chart comparison. This is currently only possible mentally.
- **Historical trend:** "How has [City] moved over time?" — if we have V1/V2 data, show a mini sparkline or trend arrow.
- **Filter by region:** "Show only Southeast Asian cities" or "Show only cities with Grade A coverage"
- **Bookmark cities:** "My watchlist" — save cities to a personal list (localStorage or user account)
- **Mobile-optimized table:** The current table is usable on mobile but could be a card-based layout for better UX.
- **Coverage legend in all 5 languages:** Fix the KO/JA gap immediately.

### Data Requirements
- [ ] URL hash encoding for weight state (technical, no external data needed)
- [ ] V1/V2 historical data for trend display (if available in the archive)
- [ ] Regional tags for each city (already partially available; needs completion)
- [ ] User account system (optional; localStorage watchlist works without accounts)

### Effort: Medium-High (3-4 weeks)
- URL sharing: 1 week
- Compare mode: 1-2 weeks
- Historical trends: 1 week (if data exists)
- Coverage legend fix: 1 day

---

## 3. City Scorecard Page (`/city/:cityId`)

### Current State
- Hero photo (if available, ~20 cities have photos)
- Tier badge + score with coverage penalty
- 5 pillars with scores and tag lines
- Peer recommendations (comparable cities)
- Editorial rationale (if available, ~25 cities)
- Note panel for tier changes
- Coverage penalty note
- Tag cloud with methodology links
- Key stats (cost of living, population, etc.)
- Methodology spider chart
- Pillar weight chart
- TTS button
- "View in Full Ranking" button

### What It Could Be: "The Definitive City Profile"
- **Full photo gallery:** 3-5 photos per city (not just 1 hero). Carousel or gallery layout.
- **City editorial for ALL 163 cities:** Every city gets a 100-200 word rationale explaining its ranking, tier placement, and unique characteristics. This is the #1 content gap.
- **Local news feed:** "Recent news from [City]" (3-5 headlines from local news, RSS or API)
- **Cost of living calculator:** "How much would YOU need to earn in [City]?" — input your current salary and city, get a purchasing power comparison.
- **Quality of life index:** "If you care about [X], [Y], and [Z], [City] ranks #N" — personalized score based on the workbench weights.
- **Neighborhood guide:** "Best neighborhoods in [City] for [families/young professionals/retirees]" — this is a major content expansion, but could be crowdsourced or sourced from local blogs.
- **Expat community:** "Connect with expats in [City]" — links to relevant Reddit communities, Facebook groups, or InterNations pages.
- **Weather widget:** Current weather + climate comparison with other cities.
- **Share card:** Open Graph meta tags so when someone shares the URL on Twitter/LinkedIn, it shows a beautiful card with the city's score, tier, and photo.
- **Comments/Discussion:** "What do you think about [City]'s ranking?" — a lightweight comment system (Disqus, Giscus, or self-hosted) for community engagement.
- **Correction submission:** "Spot an error? Submit a correction" — form that feeds into the audit log (see `data-quality-report-template.md`).

### Data Requirements
- [ ] City photos for all 163 cities (see `city-photo-sourcing-guide.md`)
- [ ] City editorial rationales for all 163 cities (see `city-editorial-template.md`)
- [ ] Local news RSS/API feeds for 50-100 major cities
- [ ] Cost of living data with salary conversion (already have Numbeo; need PPP calculator)
- [ ] Neighborhood data (crowdsourced or from local sources)
- [ ] Open Graph meta tags (technical, no external data)
- [ ] Comment system integration (Giscus is free, self-hosted, and uses GitHub Discussions)
- [ ] Correction form backend (simple email or GitHub issue creation)

### Effort: High (6-8 weeks)
- Photo curation: 2-3 weeks (parallel with editorial writing)
- Editorial writing: 4-6 weeks (with translation: 8-10 weeks)
- News feed: 1 week
- Cost calculator: 1 week
- Open Graph + share cards: 2 days
- Comments: 2 days
- Correction form: 1 day

---

## 4. Thailand Page (`/thailand`)

### Current State
- 77 provinces with 8 pillar scores
- Regional pattern cards
- Score bars with color coding
- No photos or individual province detail pages
- Summary stats for Thailand

### What It Could Be: "Thailand's Provincial Livability Atlas"
- **Individual province scorecards:** Click a province to see a detailed profile with its score breakdown, peer provinces, and a brief editorial. Currently, the table is a dead end.
- **Provincial photo:** 1 photo per province (77 photos total). This is feasible.
- **District-level data:** For the 5-10 most important provinces, show district-level (amphoe) scores if available.
- **Interactive map:** A choropleth map of Thailand showing the 77 provinces colored by score. Click a province to see its scorecard. This is much more intuitive than a table.
- **Comparative mode:** "Compare Bangkok vs. Chiang Mai vs. Phuket" — side-by-side comparison.
- **Local context:** "Why does [Province] score low on [Pillar]?" — editorial explanation for each province's strengths and weaknesses.
- **Investment guide:** "Best provinces for [digital nomads / retirees / families]" — based on the pillar scores.
- **Policy recommendations:** "To improve [Province]'s [Pillar] score, policymakers should..." — specific, actionable recommendations based on the data.

### Data Requirements
- [ ] Province-level photos (77 photos, 1 week to source)
- [ ] Province-level editorials (77 rationales, 2-3 weeks to write)
- [ ] Thailand shapefile or GeoJSON for the map (available from GADM or GeoBoundaries)
- [ ] District-level data (if available from DEPA or local sources)
- [ ] Policy recommendation framework (template-based, can be automated from scores)

### Effort: Medium-High (4-5 weeks)
- Province scorecards: 2 weeks (reusing CityScorecardPage components)
- Interactive map: 1 week (D3 or Leaflet)
- Photos: 1 week
- Editorials: 2 weeks
- Policy recommendations: 1 week (template-based)

---

## 5. Map Page (`/map`)

### Current State
- D3 geoNaturalEarth1 projection
- 163 cities as dots colored by score
- No zoom, no pan, no legend
- No interactivity beyond hover tooltip
- No country labels

### What It Could Be: "The Global City Explorer"
- **Zoom and pan:** Essential for a map. Users expect to zoom into regions.
- **Legend:** Color scale legend explaining what the colors mean. Currently missing.
- **Country boundaries:** Show country borders for context. Currently only landmass is shown.
- **City labels:** Show city names at zoom levels. Currently only tooltips on hover.
- **Filter by tier:** "Show only Alpha cities" or "Show only cities with Grade A coverage"
- **Filter by region:** "Show only Southeast Asia" or "Show only Europe"
- **Search:** "Find a city" — type a city name and fly to it on the map.
- **Click to scorecard:** Click a city dot → fly to city on map + open scorecard panel. Currently, clicking does nothing.
- **3D option:** Toggle to a 3D globe view (Three.js or Mapbox GL) for dramatic effect.
- **Data overlay:** Toggle to show other data: population density, GDP, air quality, etc. (if available)
- **Story mode:** "Follow the launch trail on the map" — animated path showing the V1→V2→V3 journey.

### Data Requirements
- [ ] Zoom/pan behavior (D3 zoom behavior or Leaflet)
- [ ] Country boundary GeoJSON (available from Natural Earth or world-atlas)
- [ ] City labels and label collision detection (D3 or Mapbox)
- [ ] Optional: 3D globe library (Three.js or deck.gl)
- [ ] Optional: Additional data layers (GDP, population, etc. from World Bank)

### Effort: Medium (2-3 weeks)
- Zoom/pan + legend: 3-4 days
- Click to scorecard: 2 days
- Search + fly-to: 2 days
- 3D toggle: 1 week (optional, nice-to-have)
- Story mode: 2 days (leveraging existing launch trail data)

---

## 6. Essay Page (`/essay`)

### Current State
- Full long-form essay in all 5 languages
- 23 references
- 5 editorial photos
- No interactive elements
- No audio/video

### What It Could Be: "The Manifesto — Multimedia Edition"
- **Audio narration:** Read the essay aloud (already have TTS, but a professional narration would be more engaging). Or: a "Listen to this essay" button with the existing TTS.
- **Video companion:** A 5-minute video summarizing the essay's key arguments. This is the #1 way to make the essay shareable.
- **Interactive charts:** The essay mentions many indices and scores. These could be interactive: click a mention to see the comparison chart, or hover to see the methodology.
- **Social sharing:** "Share this section" — quote blocks with share buttons for Twitter/LinkedIn.
- **Comments:** "Discuss this essay" — Giscus or similar.
- **PDF download:** "Download as PDF" — a formatted academic PDF for citation.
- **Translations:** The essay is already in 5 languages, which is excellent. But could add audio narration in all 5 languages.

### Data Requirements
- [ ] Video production: script, footage, editing (2-3 weeks, external vendor or in-house)
- [ ] Audio narration: professional voiceover or TTS (1 week)
- [ ] PDF generation: pandoc or similar (2 days)
- [ ] Social sharing: technical, no external data

### Effort: Medium (3-4 weeks)
- Video: 2-3 weeks (longest lead time)
- Audio: 1 week
- PDF: 2 days
- Social sharing: 1 day

---

## 7. History Page (`/history`)

### Current State
- 6-year timeline (2020-2026)
- 20+ photos
- Full 5-language translations
- Excellent content

### What It Could Be: "The Living Archive"
- **Video interviews:** Short video clips from the 2024-2025 advisory board meetings or conference presentations.
- **Documentary:** A 10-minute documentary about the making of the SLIC Index, with interviews from the founders and advisors.
- **Timeline interactivity:** Click a year to see the full story with photos, quotes, and a "What happened next" link.
- **Behind the scenes:** Photos of the data collection process, the team working, the advisory board meeting. Humanizes the project.
- **Press coverage archive:** "See what the media said about us each year" (links to press articles from that year).
- **Data evolution chart:** Show how the number of cities, metrics, and data sources grew over time. This is a powerful credibility signal.
- **Milestone badges:** "1,000,000 visitors" (when achieved), "100 cities ranked" (when achieved), etc.

### Data Requirements
- [ ] Video footage from conferences (if available)
- [ ] Documentary production: interviews, B-roll, editing (4-6 weeks, external vendor)
- [ ] Behind-the-scenes photos (if available, or staged for future editions)
- [ ] Press coverage per year (see `press-media-archive-template.md`)
- [ ] Visitor milestone data (from analytics)

### Effort: High (4-6 weeks for documentary; 1 week for other features)
- Documentary: 4-6 weeks (external vendor)
- Timeline interactivity: 2 days
- Data evolution chart: 2 days
- Press coverage: 1 week (already tracked in media archive)

---

## 8. Awards Page (`/awards`)

### Current State
- 4 awards (Red Dot, DEmark, CEA, Thailand Creative & Design Center)
- `methodologyFacts` used for stats
- Full 5-language translations
- No "what we learned" section

### What It Could Be: "The Credibility Wall"
- **Press coverage wall:** "As seen in [Bangkok Post], [The Urbanist], [Smart City Summit], etc." — logos of publications that have covered SLIC.
- **Citation count:** "Referenced in XX academic papers" (if applicable, start counting now).
- **Testimonials:** Quotes from users, mayors, urbanists, or academics about the index's impact.
- **Impact metrics:** "Used by [X] city governments for policy planning", "Referenced in [Y] research papers", "Visited by [Z] people from [N] countries".
- **Award submission archive:** "How we won the Red Dot Award — our submission deck" — this is a transparency signal and a teaching tool for others.
- **Awards we are applying for:** "Webby Awards 2027 — nominee" (if applicable). This shows ambition and keeps the team motivated.
- **Hall of fame:** If the index has influenced any specific policy or decision, document it here. "[City] used SLIC data to [action]".

### Data Requirements
- [ ] Press coverage logos (see `press-media-archive-template.md`)
- [ ] Academic citation tracking (Google Scholar alerts)
- [ ] Testimonials (reach out to users, advisors, city officials)
- [ ] Impact metrics (surveys, outreach, partnerships)
- [ ] Award submission decks (archived from previous submissions)

### Effort: Low-Medium (1-2 weeks)
- Press logos: 3 days (already tracked)
- Testimonials: 1 week (outreach + collection)
- Impact metrics: 2 days (from existing data)
- Award submission archive: 2 days (gather existing materials)

---

## 9. About Page (`/about-slic`)

### Current State
- Team bios (2 core team members)
- Methodology summary
- 20 methodology data cards with inline graphics
- Full 5-language translations
- No advisory board section
- No press kit
- No contact form

### What It Could Be: "The Trust Page"
- **Advisory board section:** Photos, bios, and expertise of the 4-6 independent advisors (see `team-advisory-template.md`). This is the #1 credibility upgrade.
- **Press kit download:** "Download press kit (ZIP)" with one-pagers, logos, headshots, and fact sheets (see `press-media-archive-template.md`).
- **Contact form:** "Get in touch" — a simple form for media inquiries, partnership requests, and data corrections. Currently, only a raw email address is shown.
- **Data transparency:** "See our data sources and coverage" — link to the Data Quality Report (see `data-quality-report-template.md`).
- **Funding transparency:** "How we are funded" — clear statement that DEPA + PMU-A are the funders, with no private sector influence. This is a trust signal.
- **Open data commitment:** "All our data is open. Download it." — link to the Google Sheets / CSV downloads.
- **Methodology video:** A 3-minute explainer video about the AMPI formula. This would make the methodology page much more accessible.
- **FAQ:** "Frequently asked questions" — e.g., "Why is Singapore Gamma?", "How do you measure 'community'?", "Can I use your data for my research?"
- **Newsletter signup:** "Stay updated" — email capture.
- **Careers / Join us:** "We are looking for data contributors, translators, and researchers." — this builds the community.

### Data Requirements
- [ ] Advisory board profiles (already designed in `team-advisory-template.md`)
- [ ] Press kit assets (one-pagers, logos, headshots)
- [ ] Contact form backend (Formspree, Netlify Forms, or email forwarding)
- [ ] Methodology video (script + production, 2 weeks)
- [ ] FAQ content (can be extracted from the essay and existing questions)
- [ ] Newsletter service (Mailchimp, Substack, or self-hosted)

### Effort: Medium (2-3 weeks)
- Advisory board: 1 week (photos, bios, translations)
- Press kit: 3 days
- Contact form: 1 day
- FAQ: 2 days
- Methodology video: 2 weeks (longest lead time)
- Newsletter: 1 day (setup)

---

## 10. Methodology Page (`/methodology`)

### Current State
- Full methodology paper (PDF link)
- Google Sheets template
- Data sources + year list
- Quality factors table
- Inline methodology graphics (20 cards)
- Full 5-language translations
- No interactive elements

### What It Could Be: "The Methodology Playground"
- **Interactive formula:** "Drag the sliders to see how the AMPI formula changes the score" — a visual, step-by-step breakdown of the formula.
- **Data quality dashboard:** Coverage grades, source counts, known issues, and the annual quality report (see `data-quality-report-template.md`).
- **Compare with other indices:** Interactive chart showing how SLIC differs from EIU, Mercer, Monocle, etc. (already partially done in the essay, but could be interactive here).
- **Coverage map:** A world map showing which regions have good data coverage and which are gaps. This visualizes the "Global South" problem.
- **Source explorer:** "Click a data source to see which cities it covers, how often it updates, and its reliability score."
- **Metric deep-dive:** "Click a metric to see its definition, formula, data source, and limitations." — this is a major transparency upgrade.
- **Methodology video:** 3-minute explainer (same as About page, but embedded here too).
- **Peer review archive:** "Read the advisory board's annual review" — published PDFs of their feedback and recommendations.
- **Changelog:** "What changed in V3 vs. V2 vs. V1" — this helps users understand the evolution and make historical comparisons.

### Data Requirements
- [ ] Interactive AMPI calculator (technical, no external data)
- [ ] Data quality dashboard (see `data-quality-report-template.md`)
- [ ] Coverage map data (from city coverage grades)
- [ ] Source explorer data (from `source-inventory.json`)
- [ ] Metric deep-dive content (expand existing definitions)
- [ ] Methodology video (same as About page)
- [ ] Peer review archive (PDFs from advisory board)
- [ ] Changelog (already tracked in `metric-changelog.json`)

### Effort: Medium-High (3-4 weeks)
- Interactive formula: 1 week
- Data quality dashboard: 1 week
- Coverage map: 3 days
- Source explorer: 3 days
- Metric deep-dive: 3 days
- Methodology video: 2 weeks (already planned for About page)
- Peer review archive: 2 days
- Changelog: 2 days

---

## 11. Ideas Page (`/ideas`)

### Current State
- 12 civic tech ideas
- Conceptual/curatorial design, not a marketplace
- No external links or "how to build this" guides
- Full 5-language translations
- Excellent visual design (cassette tape motif)

### What It Could Be: "The Civic Tech Incubator"
- **External links:** Each idea should link to existing projects that implement it. E.g., "Commune" links to local coop housing projects, "Runabout" links to existing apps.
- **Build guides:** "How to build this in your city" — a step-by-step guide for each idea, with resources, funding sources, and case studies.
- **City matcher:** "Which city needs this idea the most?" — e.g., "Commune is most needed in cities with high housing pressure" — link to the city scorecard.
- **Open source repo:** If any of these ideas are built, link to the GitHub repo.
- **Funding tracker:** "Who is funding this idea?" — track grants, government programs, or private investors working on these concepts.
- **Community forum:** "Discuss this idea" — a forum for each idea where people can share experiences, ask questions, or find collaborators.
- **Impact tracker:** "If this idea were implemented in [City], it would improve [Pillar] by [X%]" — hypothetical impact modeling.
- **Call to action:** "Build this →" button that links to a "Get Started" page with resources, or a "Submit your project" form.

### Data Requirements
- [ ] External links for each idea (research + curation, 2-3 days)
- [ ] Build guides (writing, 1 week per idea or 1 template for all)
- [ ] City matcher logic (technical, reuse existing data)
- [ ] Forum integration (Giscus or similar, 2 days)
- [ ] Impact modeling (technical, based on existing pillar scores)
- [ ] Project submission form (simple form, 1 day)

### Effort: Medium (2-3 weeks)
- External links + build guides: 1 week
- City matcher: 2 days
- Forum: 2 days
- Impact modeling: 3 days
- Submission form: 1 day

---

## 12. Compare Page (`/compare`)

### Current State
- 7 other city indices (EIU, Mercer, Monocle, Resonance, Digital City, Global Liveability, Value Champion)
- Full 5-language translations
- Comparison table with 12 categories
- No interactive elements
- No visualizations

### What It Could Be: "The Index Comparison Tool"
- **Interactive comparison:** Select an index and a city to see how that index ranks the city vs. how SLIC ranks it. Visual: two side-by-side scorecards or a radar chart showing the difference.
- **Correlation chart:** "How closely does [Index] correlate with SLIC?" — a scatter plot showing all 163 cities, with SLIC on one axis and the other index on the other axis. This would reveal which indices are most/least aligned with SLIC.
- **Methodology comparison:** "How does [Index] measure [Pillar]?" — a side-by-side comparison of how each index defines and measures livability. This is the most educational feature.
- **Bias detector:** "Which index is most biased toward wealthy cities?" — a statistical analysis showing the correlation between each index's scores and GDP per capita. This would be a powerful, shareable insight.
- **Coverage comparison:** "Which index covers the most cities?" — a bar chart showing the number of cities each index ranks.
- **Historical tracking:** "How has [Index]'s ranking of [City] changed over time?" — if historical data is available, show trends.
- **User poll:** "Which index do you trust most?" — a simple poll with results displayed. This is engagement + market research.
- **SLIC vs. the World:** A final section showing a meta-analysis of all indices, with SLIC positioned as the most comprehensive and resident-centered.

### Data Requirements
- [ ] Correlation analysis: SLIC scores vs. other index scores (if available for the same cities). For some indices, we may need to scrape or manually collect their rankings.
- [ ] Bias analysis: GDP per capita vs. each index's scores (World Bank data + index rankings)
- [ ] Historical data: past editions of other indices (if available)
- [ ] Interactive charts: technical, no external data beyond the above

### Effort: Medium-High (3-4 weeks)
- Correlation analysis: 1 week (data collection + analysis)
- Bias analysis: 3 days
- Interactive charts: 1 week
- Methodology comparison: 3 days (writing)
- Historical tracking: 1 week (if data available)
- Poll: 1 day

---

## 13. Contact Page (`/contact`)

### Current State
- Contact form (email + subject + message)
- Full 5-language translations
- No physical address
- No social media links
- No press contact
- No partnership contact

### What It Could Be: "The Hub"
- **Press contact:** Dedicated email and form for media inquiries. This is essential for an award-winning project.
- **Partnership contact:** Dedicated form for organizations wanting to collaborate or share data.
- **Data correction form:** "Spot an error? Tell us." — feeds into the audit log (see `data-quality-report-template.md`).
- **General inquiry:** Existing form, but with better UX (success message, auto-reply).
- **Social media links:** Twitter/X, LinkedIn, Facebook, Instagram — with follower counts. This shows community size.
- **Physical address:** DEPA office address in Bangkok. This adds legitimacy.
- **Newsletter signup:** "Subscribe to the monthly update" — same as Home page.
- **FAQ:** "Before you email us, check these common questions" — reduces email volume.
- **Office hours:** "We are available for video calls on [days]" — for media and partners.
- **Map:** A small map showing the DEPA office location. This is a nice visual touch.

### Data Requirements
- [ ] Separate contact forms (technical, no external data)
- [ ] Social media links and follower counts (manual, 1 hour)
- [ ] Physical address (already known)
- [ ] Newsletter service (same as Home page)
- [ ] FAQ content (same as About page)

### Effort: Low (3-4 days)
- Separate forms: 1 day
- Social media: 2 hours
- FAQ: 1 day
- Map: 1 day
- Newsletter: 2 hours (already planned)

---

## 14. Downloads Page (`/download`)

### Current State
- Downloadable rankings (PDF, XLSX, CSV, ZIP)
- Methodology paper (PDF)
- Google Sheets template
- Full 5-language translations

### What It Could Be: "The Data Library"
- **Data API:** "Access the data programmatically" — a simple JSON API for developers and researchers. This is the #1 feature for data scientists.
- **Historical data:** V1, V2, and V3 data for download. This enables longitudinal research.
- **City data packs:** Download all data for a specific city as a PDF or JSON. This is useful for city officials and researchers.
- **Custom exports:** "I want CSV with only Alpha cities, sorted by Viability" — a custom export builder.
- **Data visualization:** "Download the charts" — PNG/SVG of the spider charts, bar charts, and maps for presentations.
- **Citation guide:** "How to cite SLIC in your paper" — BibTeX, APA, MLA formats. This is essential for academic use.
- **License:** "All data is CC-BY 4.0. You are free to use it for any purpose." — clear license statement.
- **Usage tracker:** "This data has been downloaded XX times by researchers in YY countries" — social proof.
- **Integration examples:** "See how others use our data" — links to research papers, news articles, or dashboards that use SLIC data.
- **Press kit:** Same as About page, but in the Downloads section too.

### Data Requirements
- [ ] API endpoint (simple JSON server or static JSON files)
- [ ] Historical data (V1, V2 archives, if available)
- [ ] Custom export builder (technical, filter + sort + download)
- [ ] Citation guide content (writing, 1 day)
- [ ] Usage tracker (analytics, manual or automated)
- [ ] Integration examples (research, see `press-media-archive-template.md`)

### Effort: Medium (2-3 weeks)
- API: 1 week
- Historical data: 3 days (if available)
- Custom exports: 3 days
- Citation guide: 1 day
- Integration examples: 2 days
- Usage tracker: 2 days

---

## 15. Time Machine / V2 Archive (Currently a Nav Dead-End)

### Current State
- Referenced in `siteCopy.ts` nav as "V2 Archive" but no route in `App.tsx`
- Redirects to `/rankings` or 404

### What It Could Be: "The Historical Archive"
- **V2 full rankings:** The complete V2 rankings with scores, tiers, and methodology.
- **V1 full rankings:** The complete V1 rankings for historical comparison.
- **City trend pages:** "How has [City] changed from V1 to V2 to V3?" — a dedicated page showing the city's score evolution over time.
- **Change log:** "What changed between V1 and V2?" and "What changed between V2 and V3?" — methodology changes, new cities, removed cities, score shifts.
- **Historical maps:** The map as it appeared in V1 and V2.
- **Historical essays:** The original V1 essay and V2 essay (if different from V3).
- **Historical press:** "What the media said about V1/V2" (see `press-media-archive-template.md`).
- **Nostalgia mode:** "See the index as it looked in [Year]" — a fun, retro view of the old design. This is a nice engagement feature.

### Data Requirements
- [ ] V1 and V2 ranking data (archived, if available)
- [ ] V1 and V2 methodology documents (if different)
- [ ] V1 and V2 city editorials (if available)
- [ ] Historical screenshots or design files (if available)
- [ ] Trend analysis: for each city, show V1→V2→V3 scores

### Effort: Medium-High (3-4 weeks)
- Data recovery: 1 week (if V1/V2 data is available)
- Trend pages: 1 week (reusing CityScorecardPage with historical data)
- Change log: 3 days (writing)
- Historical maps: 2 days (reusing MapPage with historical data)
- Nostalgia mode: 3 days (optional, fun)

---

## Cross-Cutting Features (Every Page)

### 1. Global Search
- **What it is:** A search bar in the masthead that searches cities, metrics, pages, and content.
- **Why it matters:** Users currently have to navigate through menus to find a city. Search would be instant.
- **Data needed:** Fuse.js or similar library, indexing city names, pillar names, and page content.
- **Effort:** 1 week

### 2. Share Links & Open Graph
- **What it is:** Every page has a shareable URL that renders a beautiful card when shared on social media.
- **Why it matters:** This is the #1 growth mechanism. If users can't share their custom rankings or a city's scorecard, the index won't spread.
- **Data needed:** Open Graph meta tags (`og:title`, `og:description`, `og:image`), dynamic image generation for city scorecards.
- **Effort:** 1 week (OG tags) + 2 weeks (dynamic image generation)

### 3. Newsletter & Email Capture
- **What it is:** A monthly email with updates on city rankings, new data, methodology changes, and city spotlights.
- **Why it matters:** Re-engagement. Most visitors will visit once and never return. A newsletter brings them back.
- **Data needed:** Mailchimp, Substack, or self-hosted newsletter service. Email list management.
- **Effort:** 2 days (setup) + ongoing content (4 hours/month)

### 4. Analytics & User Feedback
- **What it is:** Beyond `trackVisitor()`, implement full analytics (privacy-respecting, e.g., Plausible or Fathom) to understand which cities are most viewed, which features are most used, and where users drop off.
- **Why it matters:** Data-driven improvement. You can't optimize what you don't measure.
- **Data needed:** Analytics service (Plausible, Fathom, or self-hosted Matomo). Privacy policy update.
- **Effort:** 2 days (setup) + ongoing analysis (2 hours/month)

### 5. Mobile App (Future)
- **What it is:** A React Native or PWA version of the index for mobile.
- **Why it matters:** 60%+ of web traffic is mobile. The current site is responsive but a native app or PWA would be faster and more engaging.
- **Data needed:** Same as website, but with offline caching for the 163 cities.
- **Effort:** 6-8 weeks (PWA is easier: 2 weeks)

### 6. Multilingual SEO
- **What it is:** Proper `hreflang` tags, sitemaps for each language, and language-specific URLs.
- **Why it matters:** Currently, the site uses `localStorage` for locale. This means Google only indexes the English version. Language-specific URLs (`/th/rankings`, `/zh/city/tw-taipei`) would dramatically improve SEO in Thai, Chinese, Korean, and Japanese markets.
- **Data needed:** Technical implementation, no external data.
- **Effort:** 1 week

### 7. Accessibility (a11y)
- **What it is:** WCAG 2.1 AA compliance: keyboard navigation, screen reader support, color contrast, alt text, focus management.
- **Why it matters:** Accessibility is a requirement for many awards (including the Webby Awards). It also makes the site usable for the 15% of users with disabilities.
- **Data needed:** Audit with axe or WAVE, fix issues. Mostly technical.
- **Effort:** 2 weeks (audit + fixes)

### 8. Performance Optimization
- **What it is:** Core Web Vitals (LCP, FID, CLS) optimization. The current site is good but could be faster, especially on mobile.
- **Why it matters:** Performance is a ranking factor for Google and a user experience metric. Slow sites lose visitors.
- **Data needed:** Lighthouse audits, image optimization, code splitting, lazy loading.
- **Effort:** 1 week

---

## Priority Matrix: What to Build First

### P0: Critical (Do Now — 1-2 weeks)
1. **Fix the V2 Archive nav dead-end** — Remove from nav or build the page. 1 day.
2. **Fix coverage legend KO/JA** — Add Korean and Japanese labels. 2 hours.
3. **Open Graph meta tags** — Make every page shareable. 1 week.
4. **Contact form** — Separate forms for press, partnerships, corrections. 2 days.
5. **City editorial rationales for top 10 cities** — Highest impact content. 1 week.
6. **City photos for top 10 cities** — Highest visual impact. 3 days.

### P1: High Priority (2-4 weeks)
1. **URL sharing for custom rankings** — The #1 viral feature. 1 week.
2. **Advisory board section on About page** — The #1 credibility upgrade. 1 week.
3. **Press kit + press coverage on About/Awards pages** — Media credibility. 1 week.
4. **Data quality report on Methodology page** — Transparency. 1 week.
5. **Newsletter signup** — Re-engagement. 2 days.
6. **Global search** — UX essential. 1 week.
7. **City photos for all 163 cities** — Full visual upgrade. 3-4 weeks.
8. **City editorials for all 163 cities** — Full content upgrade. 6-8 weeks (with translation).

### P2: Medium Priority (1-2 months)
1. **Compare mode on Rankings page** — Side-by-side city comparison. 1 week.
2. **Historical trends on Rankings/Time Machine** — V1→V2→V3 evolution. 2 weeks.
3. **Interactive map upgrades** — Zoom, pan, click, filter, search. 2 weeks.
4. **Thailand province scorecards** — Individual pages for 77 provinces. 2 weeks.
5. **Thailand interactive map** — Choropleth map. 1 week.
6. **Methodology video** — 3-minute explainer. 2 weeks.
7. **FAQ on About page** — Reduce email volume. 3 days.
8. **Essay video companion** — 5-minute summary. 2 weeks.
9. **Download API + custom exports** — Data library expansion. 2 weeks.
10. **Accessibility audit + fixes** — WCAG 2.1 AA. 2 weeks.

### P3: Future / Nice-to-Have (2-6 months)
1. **3D globe on Map page** — Three.js or deck.gl. 2 weeks.
2. **Mobile app / PWA** — Offline access. 4-8 weeks.
3. **Documentary on History page** — 10-minute film. 4-6 weeks.
4. **Real-time data feeds** — Air quality, traffic, etc. 2-4 weeks (if APIs available).
5. **Neighborhood guides on City Scorecards** — Major content expansion. 8-12 weeks.
6. **City news feeds** — RSS/API integration. 2 weeks.
7. **Cost of living calculator** — Personalized PPP. 1 week.
8. **Comments / community forum** — Giscus or similar. 2 days.
9. **Impact tracker on Ideas page** — Hypothetical modeling. 2 weeks.
10. **Correlation analysis on Compare page** — Statistical analysis. 2 weeks.
11. **Multilingual SEO** — Language-specific URLs. 1 week.
12. **Performance optimization** — Core Web Vitals. 1 week.

---

## What "Award-Winning" Looks Like

An award-winning city index is not just a research tool. It is a **daily destination** with:

1. **Instant trust** — Advisory board, data quality reports, press coverage, and transparent funding.
2. **Viral sharing** — Custom rankings, shareable city scorecards, and beautiful Open Graph cards.
3. **Engagement** — Newsletter, comments, forums, and community contributions.
4. **Visual impact** — Photos for every city, interactive maps, and a 3D globe option.
5. **Content depth** — Editorials for every city, neighborhood guides, and local news feeds.
6. **Accessibility** — WCAG 2.1 AA, multilingual SEO, and mobile-first design.
7. **Performance** — Fast load times, offline access, and smooth interactions.
8. **Data openness** — API, custom exports, clear licensing, and citation guides.
9. **Historical depth** — Time machine, trend analysis, and archival content.
10. **Policy impact** — Recommendations, partnerships, and documented influence on city governance.

---

## Estimated Total Effort

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| P0: Critical Fixes | 2 weeks | Nav fix, OG tags, top 10 photos + editorials, contact forms |
| P1: High Priority | 2 months | Full photos + editorials, advisory board, press kit, data quality report, search, newsletter |
| P2: Medium Priority | 2 months | Compare mode, historical trends, map upgrades, Thailand scorecards, methodology video, FAQ, API |
| P3: Future | 3-6 months | 3D globe, PWA, documentary, neighborhood guides, real-time data, community features |
| **Total to "Award-Winning"** | **6-8 months** | **All P0+P1+P2+P3** |
| **Total to "Strong Upgrade"** | **3-4 months** | **P0+P1+P2** |
| **Total to "Quick Wins"** | **2-4 weeks** | **P0 only** |

---

*End of Vision Document*
