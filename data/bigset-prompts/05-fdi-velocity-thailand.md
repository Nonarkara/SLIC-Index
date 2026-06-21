# BigSet prompt — FDI Capital Attraction Velocity / Thailand DBD (Axis 6)

## Dataset description (paste into BigSet verbatim)

Thailand monthly foreign business investment approvals under the Foreign Business Act B.E. 2542 (1999), from the Department of Business Development (DBD), Ministry of Commerce (กรมพัฒนาธุรกิจการค้า กระทรวงพาณิชย์), for calendar years 2024, 2025, and 2026 (as available). For each period include: year, month, approved investor count, total investment value in THB billions, and source URL. Note: this is FBA approval data, NOT BOI-promoted investment data (separate stream). Primary source: DBD's Foreign Business Committee monthly press releases.

## Target schema

| Column | Type | Notes |
|---|---|---|
| year | integer | e.g. 2026 |
| month | integer | 1-12 |
| investors | integer | approved investor count |
| value_thb_b | float | total value in THB billions |
| value_usd_b | float | approximate USD (note FX rate used) |
| fx_rate | float | THB/USD rate used for conversion |
| source_url | string | DBD press release or portal URL |

## Refresh cadence

Monthly (DBD publishes within 4-6 weeks of period end).

## SLIC tile this feeds

ThailandPage → th-fdi-section stat cards.
Current tile shows: 528 investors / ฿153.56B / +73% YoY (Jan–May 2026 only).
BigSet dataset would give the full 24-month series for trend context.

## Current data source (being replaced)

Single data point hardcoded in `src/ThailandPage.tsx`:
The Nation Thailand article (June 2026) citing DBD Director-General.

## Spike priority

LOW — DBD primary releases are in Thai. BigSet's web agents may handle
Thai-language pages with varying reliability. Spike billionaire density
(prompt 01) and OECD hours (prompt 03) first. Return to this if those
spike successfully.

## Verification requirement (EGO-VOID)

The Nation article (journalism) is the current source. Before publishing
in SLIC rankings, verify against DBD's primary release:
- DBD portal: dbd.go.th → ข่าวประชาสัมพันธ์ → คณะกรรมการประกอบธุรกิจของคนต่างด้าว
- DBD director-general: Poonpong Naiyanapakorn
- Single-year 73% surge may reflect low 2025 base — show 3-year trend before ranking

## Output path

`data/verified_sources/fdi-velocity-thailand.csv`
