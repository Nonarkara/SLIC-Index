export interface BrandAsset {
  name: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

// The site's own identity is not here on purpose. The masthead renders the
// wordmark as live type; the footer renders the real SLIC Index artwork from
// /Logos/slic-index-mark.png, keyed off its paper. The old 400×400 master
// (slic-index-full.png) is a square raster with an opaque ground — it stays in
// the repository for the other projects that reference it, but no surface here
// may load it. `test/system-integrity.test.mjs` gates all of that.

/**
 * The row of key supporters.
 *
 * Every one of these is a transparent PNG keyed off its paper by
 * `scripts/build-partner-logos.sh`, so none of them carries a white plate
 * onto the cream ground. The sources live in `logo-sources/logos/` and are not
 * published; the keyed marks are what the site serves.
 *
 * The order is the collaboration sentence's order, with the house mark last:
 * the partners are named left to right, and SLIC closes the line as the mark
 * that made them a row in the first place.
 */
export const collaborationLogos: BrandAsset[] = [
  {
    name: "RCAD (รวพ.)",
    src: "/Logos/rcad-sdw.png",
    alt: "สำนักงานเร่งรัดการวิจัยและนวัตกรรมเพื่อเพิ่มความสามารถการแข่งขันและการพัฒนาพื้นที่ (องค์การมหาชน) — SDW",
    width: 904,
    height: 360,
  },
  {
    name: "depa",
    src: "/Logos/depa_logo.png",
    alt: "depa — Digital Economy Promotion Agency",
    width: 943,
    height: 563,
  },
  {
    name: "Smart City Thailand Office",
    src: "/Logos/smart_city_thailand_logo.png",
    alt: "Smart City Thailand Office",
    width: 873,
    height: 1090,
  },
  {
    name: "ReTL",
    src: "/Logos/retl_logo.png",
    alt: "ReTL — The Reason to Live Company",
    width: 977,
    height: 934,
  },
  {
    name: "Axiom",
    src: "/Logos/axiom_logo.png",
    alt: "Axiom",
    width: 1177,
    height: 1172,
  },
  {
    name: "SLIC Index",
    src: "/Logos/slic-index-monogram.png",
    alt: "SLIC Index",
    width: 389,
    height: 174,
  },
];
