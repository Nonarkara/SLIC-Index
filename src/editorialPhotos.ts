export interface EditorialPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

export const editorialPhotos: EditorialPhoto[] = [
  {
    id: "skyline",
    src: "/photos/slic-skyline.jpg",
    alt: "Urban skyline with layered towers and a clear sense of city scale.",
    caption: "SLIC begins with the whole city as lived form: scale, openness, structure, and urban possibility.",
  },
  {
    id: "waterfront",
    src: "/photos/slic-waterfront.jpg",
    alt: "Waterfront cityscape with a mix of public space, skyline, and daily movement.",
    caption: "Public edge conditions matter. A city reveals itself in how water, public space, and movement meet.",
  },
  {
    id: "overlook",
    src: "/photos/slic-overlook.jpg",
    alt: "A city seen from above with layered districts and varied urban texture.",
    caption: "The board is meant to surface depth and variation, not just reward the most polished business districts.",
  },
  {
    id: "night-square",
    src: "/photos/slic-night-square.jpg",
    alt: "A historic square illuminated at night with people moving through the open space.",
    caption: "Historic continuity, nightlife, and public life all matter when a city is judged for how it feels to inhabit.",
  },
];

export const homeSupportPhotos: EditorialPhoto[] = [
  {
    id: "fountain",
    src: "/photos/report-city-fountain.jpg",
    alt: "People moving through an active public plaza with a city skyline beyond.",
    caption:
      "SLIC pays attention to whether public life feels open, calm, and socially usable, not just whether the skyline looks rich.",
  },
  {
    id: "kuching",
    src: "/photos/report-city-kuching.jpg",
    alt: "A riverfront city scene with civic architecture and a strong local identity.",
    caption:
      "Secondary cities matter because livability often appears where regional identity, affordability, and urban rhythm still hold together.",
  },
];
