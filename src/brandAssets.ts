export interface BrandAsset {
  name: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const slicLogo: BrandAsset = {
  name: "SLIC Index",
  src: "/Logos/slic-index-full.png",
  alt: "SLIC Index logo",
  width: 140, // Approximate horizontal ratio
  height: 36,
};

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
    name: "Axiom",
    src: "/Logos/axiom_logo.png",
    alt: "Axiom",
    width: 528,
    height: 266,
  },
  {
    name: "ReTL",
    src: "/Logos/retl_logo.png",
    alt: "ReTL — The Reason to Live Company",
    width: 528,
    height: 266,
  },
];
