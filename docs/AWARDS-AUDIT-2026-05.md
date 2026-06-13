# SLIC Index V3 — Awards Audit · 2026-05-26

Single document. Four scorecards. One cross-award gap matrix at the end so a fix that pays for itself in multiple submissions is obvious.

- **Branch under audit:** `codex/red-dot-design-2-5-1`
- **Live site at audit time:** https://slic.nonarkara.org
- **Score model:** `slic-v3.4.0` · **Tier policy:** `public-tier-v1.3.0`
- **Universe:** 163 cities (158 ranked + 5 watchlist), 5 pillars, 22 scored metrics + 3 diagnostics, AMPI absolute scoring, A-grade coverage floor for Alpha
- **Locales:** EN / TH (ผม register, non-looped IBM Plex Sans Thai) / ZH (Simplified, Noto Sans SC)

## Calendar reality

| Award | 2026 cycle | Target cycle |
|---|---|---|
| Red Dot Brands & Communication | **Closed** — Latecomer deadline 8 May 2026 | **Red Dot 2027** — Early Bird opens ~Feb 2027 |
| DEmark (Design Excellence Award Thailand) | **Closed** — Step 2 deadline 8 May 2026 | **DEmark 2027** — opens Q1 2027 |
| CEA Creative Excellence — Creative Technology | **Likely still open** — 2026 packet not yet published, historical cycle June–August | **2026** if the packet drops in June |
| CEA Creative Excellence — Creative Advocacy | Same as above | **2026** companion entry |

The audit therefore frames SLIC for 2027 Red Dot + DEmark and 2026 CEA. Submission packet for CEA is **relationship-led, not public** — DEPA channel via info@cea.or.th is the recommended route (Non handles personally per plan decision 2).

---

## 1 · Red Dot Award · Brands & Communication Design · **Editorial Design**

Category positioning per plan decision 1: SLIC enters as a **publication**, not as a workbench or a data-rendering artifact. The op-ed voice is the differentiator; methodology rigor is the supporting evidence. Red Dot permits one category per project.

### What a juror reads first

The Red Dot Brands & Communication initial-screen flow:
1. Project thumbnail in the entrant grid (sized for visual triage)
2. 500–1,200 character English description on the project page
3. Live URL — juror clicks through; typically scrolls one screen and reads one section
4. Optional video (round-two material; not scored at first screen)

For SLIC the live URL lands on `https://slic.nonarkara.org/` → the homepage hero ("Thriving, and still affordable. Everything else is marketing.") followed by the Alpha tier band. Editorial juror reads voice and pacing here; if it clears the first screen they go to `/methodology` or `/essay` for evidence depth.

### Scorecard

| Red Dot criterion (Editorial Design) | State | Evidence on site | Action |
|---|---|---|---|
| **Originality** | 🟢 | Op-ed positioning is unique in the city-index field — every competitor (EIU, Mercer, Resonance, Monocle, IMD, GPCI, Hanke, Oxford Economics, Yonsei-Cambridge, SLIC Soft Power) reads as a data dashboard. SLIC reads as a publication. | Hold. Sharpen the one-liner on `/awards`. |
| **Design Quality (visual)** | 🟢 | Custom CSS, "Monocle meets Red Dot" aesthetic per project CLAUDE.md, three-size typography hierarchy (32 / 14 / 11), mono-amber accent, zero rounded corners, zero gradients, hairline borders. The IBM Plex Sans Thai fix from Pass 2 last night closes the §0 looped-Thai gap that would have caused a Bangkok juror to dismiss the site at first glance. | Hold. Contrast pass on `/awards` before deploy. |
| **Creative Achievement** | 🟢 | The AMPI scoring + public-tier overlay (Alpha/Beta/Gamma with country caps + coverage floor + city exclusions) is a novel synthesis. Editorial frame ("Bangkok wins Alpha because median residents thrive") is original. | Hold. Surface the editorial frame in `/awards` lens-block #1. |
| **Effectiveness (communication / brand impact)** | 🟡 | The site communicates. Impact evidence — citations, partner adoptions, summit appearances — is currently buried in the History page. A juror who needs to verify reach has to dig. | **Fix this pass:** dedicated impact-evidence section on `/about-slic` + `/awards`. Placeholders Non fills with the receipts. |
| **Tone-of-voice integrity** | 🟢 | Every page carries the same voice: provocation, evidence chain, no-imputation policy, no-paid-inclusion clause in footer. Three locales preserved (ผม first-person, Simplified Chinese mainland register, modern professional English). | Hold. |
| **Narrative pacing across the publication** | 🟡 | Homepage → Rankings → Methodology → Compare arc is strong. The `/essay` page exists as long-form, but isn't linked from the homepage above-the-fold. A juror reading sequentially may miss it. | **Fix this pass:** small "Read the long form" link in homepage Alpha bridge or near the bottom CTA strip. (Single-line nav text change.) |
| **Editorial typography / hierarchy** | 🟢 | Three-size hierarchy (§11.7) is enforced. Mono numerics tabular. Eyebrow / body / display tiers crisp. | Hold. |
| **Self-explanatory quality** | 🟢 | Methodology page renders the equations, the worked Bangkok example, the source per metric. A juror who lands cold can audit any score. | Hold. |
| **Realization (technical execution)** | 🟢 | Clean build, 21/21 tests green, integrity checks pass, no console errors, no horizontal overflow at 375px, all 36 assets resolve. | Hold. |
| **Emotional content** | 🟡 | "Every city ranking is a lie. Here's ours." carries it on the homepage. The History page carries it in autobiography. But there's no single moment that captures the *why* of the project for a juror in 30 seconds. | **Fix this pass:** `/awards` hero band leads with one tight paragraph: who built it, why it had to exist, what changes when readers use it. |

### Red Dot deliverables required

- Live URL ✓
- 500–1,200 character EN description — **draft tonight as part of `/awards` page hero**
- Project images, Latin filenames — Non to provide screenshots (deferred)
- Optional 60-sec video — **script drafted tonight as `docs/submission-video-script.md`**, recording is October-ish
- Publication window: project must be published 1 Jul 2023 – 1 Jul 2026 — V3 launched Mar 2026 ✓

### Submission window

- 2026 cycle: closed (Latecomer 8 May 2026)
- **2027 cycle Early Bird:** ~13 Feb 2027 · €250 fee
- Results: July 2027 · Gala: November 2027 Berlin

---

## 2 · Red Dot Award · Brands & Communication Design · **Information Design** (secondary frame)

Not entering as Information Design (one category only, Editorial wins on differentiation), but the Information-Design criteria are useful as a self-audit because the methodology page + per-metric source chain is the strongest part of the site by this lens. Use this scorecard to identify any rigor gap that *also* hurts the Editorial submission.

| Information Design criterion | State | Action |
|---|---|---|
| **Clarity of hierarchy** | 🟢 | Three-size type scale; pillar groupings; mono labels. | Hold. |
| **Accuracy of data representation** | 🟢 | AMPI is mathematically declared in the methodology paper. No imputation. Coverage grades visible. | Hold. |
| **Evidence chain visible to reader** | 🟢 | Every metric on every city carries `source`, `sourceUrl`, `dataLevel` in `publishedRankingData.json`. The `/data` page surfaces the source desk (534 source labels per the May-01 prep doc). | Hold. **The audit-doc surfaces this as a top-3 SLIC strength.** |
| **Typographic discipline** | 🟢 | Latin face (Libre Baskerville / Inter / JetBrains Mono) consistent. Thai now non-looped via IBM Plex Sans Thai (Pass 2 fix). Chinese now Noto Sans SC. | Hold. |
| **Structural elegance** | 🟢 | Methodology page is reader-routed (lay reader vs technical reader). | Hold. |
| **Document-grade artifact** | 🟡 | The PDF (`slic-methodology-technical-paper-{en,th,zh}.pdf`) is functional but utilitarian — no cover page, no TOC, citation block is inline rather than indexed. | **Fix this pass:** PDF cover + TOC + numbered citation block in `scripts/generate_methodology_pdf.py`. |
| **CSV / dataset rigor** | 🟡 | `slic-ranked-cities-v2.csv` carries scores but no top-of-file metadata block. A juror who downloads the CSV gets columns, no provenance preamble. | **Fix this pass:** prepend metadata comment lines (publisher, methodology URL, license, citation form, score model version, tier policy version) to the CSV. |

---

## 3 · DEmark · Design Excellence Award Thailand · **System Service & Digital Platform**

DEmark is the Thai government's design award (DITP + CEA jointly). The named criteria are explicit and load-bearing — unlike Red Dot's pillar trio, DEmark publishes a five-criterion rubric and the video is mandatory.

### Named criteria

1. **Design Story** — what problem, who for, what design moves made
2. **Innovative Thinking** — what's novel in approach / method / synthesis
3. **Emotional & Aesthetic Quality** — does the work move people
4. **User Value** — verifiable usefulness to a specific audience
5. **Sustainable Value** — endurance, ecological/social sustainability, scalability across ASEAN

DEmark 2025 theme: ***"The Liveable Creation"*** — direct semantic match to SLIC. Carry this through the submission narrative.

### What a juror does

DEmark jury workflow leans heavily on the **mandatory 1–3 minute video**. The bilingual TH/EN form is read second. Live URL is read third. Submission must evidence ≥3-month market presence — SLIC V3 launched March 2026, comfortably past the 3-month bar by the next cycle.

### Scorecard

| DEmark criterion | State | Action |
|---|---|---|
| **Design Story** | 🟡 | The story exists across `/about-slic`, `/history`, `/essay`, the methodology paper. It is not yet captured as a single short narrative — the form needs a 200–400 word answer in TH and EN. | **Fix this pass:** drafted as the hero block of `/awards` page (EN/TH/ZH); becomes the source text for the DEmark form. |
| **Innovative Thinking** | 🟢 | AMPI + public-tier overlay + editorial exclusion rule + Bangkok-as-anchor are all genuinely new in the city-index field. No-imputation rule contrasts with every competitor. | Hold. Surface as `/awards` lens-block #2. |
| **Emotional & Aesthetic Quality** | 🟢 | Editorial voice + photographic hero + non-looped Thai typography + amber accent. | Hold. |
| **User Value** | 🟡 | Workbench (Rankings page) lets readers rebuild SLIC's top 10 from their priorities. Live since Mar 2026 across 3 locales. Need to surface adoption signals — visitor count, citations, downstream partner use. | **Fix this pass:** impact-evidence section on `/awards` + `/about-slic`. Scaffolded with placeholders Non fills. |
| **Sustainable Value** | 🟢 | Open methodology + open CSV + open source code + multilingual reach + DEPA + PMU-A institutional backing = durable infrastructure, not a campaign. Endurance argument is strong. | Hold. Surface explicitly on `/awards`. |

### DEmark deliverables required

- Bilingual TH/EN application form ✓ (data in repo; Non fills the form)
- **Mandatory 1–3 minute presentation video** — script drafted tonight; recording is October-ish
- Proof of ≥3-month market presence ✓ (V3 launched Mar 2026)
- Up to 5 entries per category (we use 1)

### Submission window

- 2026 cycle: closed
- **2027 cycle:** opens Q1 2027 (historical Step 1 around 30 Apr, Step 2 around 8 May)
- Fee: not publicly disclosed; DITP/CEA absorb cost in past cycles. Verify with DITP.

---

## 4 · CEA Creative Excellence Awards — Creative Technology Award + Creative Advocacy Award

The CEA awards are not a design competition in the Red Dot sense. They reward *impact through creative work* and the submission packet is **relationship-led** — typical entry route is via DEPA partner channel. Public criterion: "novel idea that creates and increases value… positive impact on the economy and society."

### Two entries from the SLIC universe

**(A) Creative Technology Award** (Creative Business track) — primary entry.
SLIC framed as: open-methodology civic infrastructure built by Thai academics that gives every reader the tools to audit city rankings, scaled across ASEAN through trilingual delivery.

**(B) Creative Advocacy Award** (Creative City track) — companion entry.
SLIC framed as: provocation against city-ranking marketing economy. Every metric traces to a source, no city paid for placement, the editorial argument is visible.

### Operational lens (both awards)

1. **Novelty** — the idea is materially new in its field
2. **Value creation** — quantifiable benefit to a defined audience
3. **Positive impact** — economic + social + cultural
4. **Sustainability / tangibility** — the work endures past the moment of award
5. **Thailand-to-world relevance** — Thai creative leadership projected outward

### Scorecard (applies to both A and B)

| CEA criterion | State | Action |
|---|---|---|
| **Novelty** | 🟢 | Same as Red Dot Originality + DEmark Innovative Thinking. The AMPI + tier overlay + no-imputation + open-data triple is a first in the city-index field, especially Thailand-led. | Hold. |
| **Value creation** | 🟡 | The site delivers value to readers, but the impact evidence — who has cited SLIC, which partners have adopted methodology, which cities have used the workbench — is not surfaced publicly. | **Fix this pass:** impact-evidence placeholders on `/awards`. |
| **Positive impact** | 🟡 | The argument is sound but jurors will want concrete examples. Need: at least 3 named citations or partner usages on `/awards`. | **Fix this pass + Non to fill placeholders before submission.** |
| **Sustainability / tangibility** | 🟢 | Open code + open data + multilingual + DEPA + PMU-A + CMU = enduring infrastructure, not a campaign. | Hold. Surface as `/awards` provenance band. |
| **Thailand-to-world relevance** | 🟢 | Thai-led academic project (Dr. Non Arkara + A.P. Poon Thiengburanathum, Chiang Mai University), Thai institutional funding (DEPA + PMU-A), Bangkok as anchor city in the editorial argument, trilingual delivery. ASEAN-relevant. Exactly the CEA brief. | Hold. **The audit's top-1 SLIC strength against CEA.** |

### CEA deliverables required

- Case statement: who, what change, what evidence — drafted as `/awards` hero + lenses
- Impact evidence: citations + partner adoption + summit appearances + visitor reach — **placeholders this pass; Non fills**
- Supporting media: live URL, methodology PDF, CSV, screenshots
- Presentation: typically a 5–10 minute deck for shortlist round

### Submission window

- **2026 cycle:** packet not yet publicly released; historical cycle opens June, closes August. Ceremony historically late September at EMSphere (Bangkok)
- 2025 packet was relationship-led — packet sent to short-listed candidates rather than open call. **Recommendation:** Non to contact info@cea.or.th via DEPA channel to confirm.

---

## Cross-award gap matrix — fixes paying for themselves

| Fix shipping this pass | Red Dot Editorial | Red Dot Info Design | DEmark | CEA Tech | CEA Advocacy |
|---|:-:|:-:|:-:|:-:|:-:|
| `/awards` page (case statement + lenses) | ★★★ | ★★ | ★★★ | ★★★ | ★★★ |
| Impact-evidence placeholders | ★★ | ★ | ★★ | ★★★ | ★★★ |
| Press / talks panel on `/about-slic` | ★★ | ★ | ★★ | ★★★ | ★★ |
| Methodology PDF cover + TOC + citations | ★★ | ★★★ | ★★ | ★ | ★ |
| CSV metadata header | ★ | ★★★ | ★★ | ★ | ★ |
| Footer citation strip | ★ | ★★ | ★★ | ★★ | ★★ |
| Video script (EN + TH) | ★★ | — | ★★★ | ★★ | ★★ |
| Refresh `docs/pre-submission-status.md` | ★ | ★ | ★ | ★ | ★ |
| `/essay` link in homepage CTA cluster | ★★ | — | ★ | ★ | ★ |
| Contrast verification on `/awards` | ★★ | ★ | ★★ | ★ | ★ |

★★★ = high value · ★★ = solid value · ★ = supporting value · — = no impact

---

## Deferred — Non to action before any submission

| Deferred item | Why deferred | Who owns |
|---|---|---|
| Project images / screenshots in Latin filenames (Red Dot deliverable) | I can't create photography on Non's behalf | Non |
| Open Graph 1200×630 card image refresh | No image-gen tooling in repo; should not add one tonight | Non (or future pass with image tooling) |
| Filling the impact-evidence placeholders on `/awards` (citations / press / partner adoption) | Plan decision 3: scaffolded placeholders only; nothing falsifiable goes live tonight | Non |
| Video recording (60–90 sec) for DEmark + Red Dot R2 | Script drafted tonight; recording requires Non's voice + studio setup | Non, October-ish |
| DEPA/CEA partner-channel outreach for CEA 2026 packet | Plan decision 2: relationship channel is Non's | Non |
| DEmark 2027 fee verification (call DITP) | Public sources don't disclose; CEA/DITP absorbed in past cycles | Non |
| One Red Dot category lock-in (Editorial vs Information Design vs Apps/UX) | **Locked: Editorial** per plan decision 1 | ✓ |

---

## Source citations for criteria

Captured from agent research filed in `/Users/nonarkara/.claude/plans/now-that-we-are-snug-stearns-agent-a6f3b6c8928c4208d.md`. Load-bearing URLs:

- Red Dot Brands & Communication: https://www.red-dot.org/bcd · /bcd/categories · /bcd/faq
- Red Dot magazine — Interface/UX coverage: https://www.red-dot.org/magazine/communication-design-at-the-highest-level-awarded-interface-user-experience-design
- Red Dot magazine — Editorial coverage: https://www.red-dot.org/magazine/award-winning-annual-reports
- DEmark application: https://demarkaward.net/en/2026/how-to-apply · https://www.cea.or.th/en/network-updates/demark-award-2024
- CEA Creative Excellence Awards: https://www.cea.or.th/en/single-project/creative-excellence-awards-2025
- Fee table (Contest Watchers): https://www.contestwatchers.com/red-dot-award-brands-communication-design-2026/

---

## Sign-off

Audit complete · Pass 3 surface-fix work begins immediately after this commit · Cross-award gap matrix is the priority order for the remaining tasks.
