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

export const collaborationLogos: BrandAsset[] = [
  {
    name: "UWN (PMU-A)",
    src: "/Logos/uwn_pmu_a_logo.jpeg",
    alt: "UWN (PMU-A) logo",
    width: 323,
    height: 156,
  },
  {
    name: "depa Thailand",
    src: "/Logos/depa_logo.jpg",
    alt: "Digital Economy Promotion Agency logo",
    width: 1182,
    height: 798,
  },
  {
    name: "Smart City Thailand",
    src: "/Logos/smart_city_thailand_logo.jpg",
    alt: "Smart City Thailand Office logo",
    width: 1182,
    height: 1182,
  },
  {
    name: "ReTL",
    src: "/Logos/retl_logo.png",
    alt: "ReTL — The Reason to Live Company",
    width: 528,
    height: 266,
  },
];
