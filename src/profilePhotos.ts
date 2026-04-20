export interface ProfilePhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
}

export const profilePhotos: ProfilePhoto[] = [
  {
    id: "profile-team",
    src: "/photos/profile-team-asean.jpg",
    alt: "A group portrait taken after a regional meeting.",
    caption: "The wider SLIC platform is built through regional collaboration, not single-author abstraction.",
    width: 2915,
    height: 1640,
  },
  {
    id: "profile-group",
    src: "/photos/profile-group-depa.jpg",
    alt: "A group gathered in front of a presentation screen after a session.",
    caption: "Programmes, pilots, and public experimentation are part of the institutional story behind the index.",
    width: 4032,
    height: 3024,
  },
];
