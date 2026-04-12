export interface BrandAsset {
  name: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const slicLogo: BrandAsset = {
  name: "SLIC",
  src: "/Logos/SLIC logo.jpg",
  alt: "SLIC logo",
  width: 200,
  height: 200,
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
    name: "AXIOM AI",
    src: "/Logos/axiom_ai_logo.png",
    alt: "AXIOM AI logo",
    width: 1000,
    height: 1000,
  },
];
