export interface ProfilePhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

export const profilePhotos: ProfilePhoto[] = [
  {
    id: "profile-team",
    src: "/photos/profile-team-asean.jpg",
    alt: "A group portrait taken after a regional meeting.",
    caption: "The wider SLIC platform is built through regional collaboration, not single-author abstraction.",
  },
  {
    id: "profile-group",
    src: "/photos/profile-group-depa.jpg",
    alt: "A group gathered in front of a presentation screen after a session.",
    caption: "Programmes, pilots, and public experimentation are part of the institutional story behind the index.",
  },
  {
    id: "profile-origin-panel",
    src: "/photos/report-origin-panel.jpg",
    alt: "A formal public panel session focused on city systems and implementation.",
    caption: "The public-facing index sits inside a wider institutional process of review, dialogue, and delivery.",
  },
  {
    id: "profile-origin-stage",
    src: "/photos/report-origin-stage.jpg",
    alt: "A stage presentation during a public smart-city event.",
    caption: "SLIC is framed as public city work: explanation, critique, programme design, and implementation readiness.",
  },
];
