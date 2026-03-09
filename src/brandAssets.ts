export interface BrandAsset {
  name: string;
  src: string;
  alt: string;
}

export const slicLogo: BrandAsset = {
  name: "SLIC",
  src: "/Logos/SLIC logo.jpg",
  alt: "SLIC logo",
};

export const collaborationLogos: BrandAsset[] = [
  {
    name: "Ministry of Digital Economy and Society",
    src: "/Logos/Ministry of Digital Economy and Society logo.jpg",
    alt: "Ministry of Digital Economy and Society logo",
  },
  {
    name: "Digital Economy Promotion Agency",
    src: "/Logos/Digital Economy Promotion Agency logo.jpg",
    alt: "Digital Economy Promotion Agency logo",
  },
  {
    name: "Smart City Thailand Office",
    src: "/Logos/Smart City Thailand Office Logo.jpg",
    alt: "Smart City Thailand Office logo",
  },
  {
    name: "AXIOM AI",
    src: "/Logos/axiom-ai-mark.png",
    alt: "AXIOM AI logo",
  },
];
