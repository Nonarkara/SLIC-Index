# SLIC Index V3 — The Ranking That Disagrees

> "Every city ranking is a lie. Here's ours."

**163 cities, 158 ranked. 5 pillars. 22 scored signals + 3 diagnostics. Every score traceable.** No paywall. No proprietary black box. No 12-month lobby cycle.

SLIC is the first city ranking that admits what it measures and why. EIU calculates hardship pay for expats. Mercer does the same for HR departments. Resonance measures Instagram buzz. Monocle curates lifestyle for the already-rich. Yonsei counts smart city apps without asking if they help anyone.

SLIC measures what's left after rent.

## What Makes V3 Different

- **Op-ed editorial homepage** — not a dashboard, a publication. Makes the argument, shows the evidence, hands you the tool.
- **Ten-index comparison** — side-by-side with EIU, Mercer, Resonance, Monocle, Yonsei-Cambridge, IMD, Global Power City Index, Oxford Economics, Hanke Annual Misery, and SLIC Soft Power. Hover any city to see where else it appears.
- **Blind spots diagram** — checkmark grid showing what each index measures. SLIC is the only one that covers all eight dimensions.
- **Interactive spider** — drag to rebuild SLIC's top 10 based on your priorities. The other nine indices stay frozen.
- **Watchlist transparency** — war zones and cities with insufficient data are on our watchlist, not quietly dropped.
- **Multilingual** — English, Thai, Chinese. Every piece of copy.

## The Five Pillars

| Pillar | Weight | What It Measures |
|--------|--------|-----------------|
| **Growth** | 25% | Economic dynamism. What's left after rent. Housing burden. Working-time pressure. |
| **Viability** | 22% | Safety. Transit. Clean air. Digital infrastructure. Climate. |
| **Capability** | 18% | Healthcare access. Education quality. Equal opportunity. |
| **Community** | 15% | Belonging. Tolerance. Cultural life. Whether your neighbors want you there. |
| **Creative** | 20% | Entrepreneurial friction. Innovation intensity. Government stability. |

## Live

**[View V3 →](https://slic.nonarkara.org/)** (Cloudflare Pages, custom domain)
**[Mirror →](https://nonarkara.github.io/SLIC-Index/)** (GitHub Pages)

## Version History

| Version | What Changed | Live |
|---------|-------------|------|
| **[V1](https://github.com/Nonarkara/slic-landing-page)** | 103 cities. The LinkedIn provocation that started it all. | [GitHub Pages](https://nonarkara.github.io/SLIC-Index-V1/) |
| **[V2](https://github.com/Nonarkara/SLIC-Index-V2)** | SCSE 2026 Taipei launch. Interactive spider. 174 cities. European mayors asked to replace The Economist's index. | [GitHub Pages](https://nonarkara.github.io/SLIC-Index-V2/) |
| **V3** (you are here) | Op-ed redesign. 158 ranked cities + 5 watchlist (163 total). Ten-index comparison. Blind spots diagram. Watchlist transparency. AMPI absolute scoring. Public-tier overlay (Alpha/Beta/Gamma) with A-grade coverage floor for Alpha. | [slic.nonarkara.org](https://slic.nonarkara.org/) |

## Tech Stack

- React 19 + TypeScript 5.8 + Vite 6 (no Tailwind — custom CSS only)
- Interactive spider web allocator (custom SVG + pointer events)
- Real-time city re-ranking with zero-sum weight allocation
- Visitor tracking (Google Sheets + Supabase dual-write, with Cloudflare Web Analytics)
- Static deployment: Cloudflare Pages (production at slic.nonarkara.org) + GitHub Pages mirror

## Created By

**Dr. Non Arkara** and **Associate Professor Poon Thiengburanathum**, in collaboration with:
- Ministry of Digital Economy and Society, Thailand
- Digital Economy Promotion Agency (depa)
- Smart City Thailand Office
- PMU-A (Program Management Unit for Area-Based Development)
- Axiom × ReTL (research pipeline + AI tooling)

## License

Released under the [MIT License](LICENSE). SLIC is intended for public citation, teaching, replication, and critique. Keep the source visible, preserve the declared methodology, and do not imply paid placement or endorsement.

---

*SLIC is free, public, and transparent. Every number traces back to its source. No city, developer, government, vendor, or sponsor paid for inclusion, weighting, placement, or editorial treatment in this index.*
