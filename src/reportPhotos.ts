export interface ReportPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

export const reportOriginPhotos: ReportPhoto[] = [
  {
    id: "origin-stage",
    src: "/photos/report-people-stage.jpg",
    alt: "A group of people standing together on stage during a public urban event.",
    caption: "The work grew out of real convenings, public programmes, and institutional collaboration rather than isolated desk theory.",
  },
  {
    id: "origin-meeting",
    src: "/photos/report-people-meeting.jpg",
    alt: "A meeting room with participants discussing around a table with laptops and microphones.",
    caption: "Methodology was tested in meetings, briefs, and working sessions where assumptions had to survive practical scrutiny.",
  },
  {
    id: "origin-workshop",
    src: "/photos/report-people-workshop.jpg",
    alt: "A facilitator speaking to a seated group during a workshop discussion.",
    caption: "The methodology keeps a dialogue structure: benchmark, challenge, workshop, refine, and only then publish.",
  },
];

export const reportWorkflowPhotos: ReportPhoto[] = [
  {
    id: "workflow-dialogue",
    src: "/photos/report-origin-dialogue.jpg",
    alt: "People in conversation during a working session on city strategy and implementation.",
    caption:
      "The methodology was stress-tested through dialogue, disagreement, and practical review rather than treated as a decorative theory.",
  },
  {
    id: "workflow-panel",
    src: "/photos/report-origin-panel.jpg",
    alt: "A formal panel session with speakers and participants discussing urban systems.",
    caption:
      "Public explanation matters. A serious index has to be legible in workshops, rooms, and policy discussions, not just on a landing page.",
  },
  {
    id: "workflow-stage",
    src: "/photos/report-origin-stage.jpg",
    alt: "A public event stage with participants presenting ideas and field results.",
    caption:
      "SLIC is built as a live civic instrument: benchmark, test, communicate, revise, and publish again as conditions change.",
  },
];

export const reportFeaturePhoto: ReportPhoto = {
  id: "city-night",
  src: "/photos/report-city-night.jpg",
  alt: "A historic square illuminated at night with people crossing the open space.",
  caption:
    "Urban quality is not only measured in daylight spreadsheets. Nighttime public life, historic continuity, and social confidence reveal whether a city still feels alive.",
};

export const rankingPhotos: ReportPhoto[] = [
  {
    id: "city-rail",
    src: "/photos/report-city-rail.jpg",
    alt: "Dense skyline with elevated rail and layered housing in the foreground.",
    caption:
      "A good ranking reads the city as movement, housing pressure, and metropolitan form, not just as a list of elite districts.",
  },
  {
    id: "city-walkway",
    src: "/photos/report-city-walkway.jpg",
    alt: "Pedestrians moving along an elevated urban walkway with high-rise buildings around them.",
    caption:
      "The board rewards what life feels like at eye level: access, friction, rhythm, and the confidence to move through the city well.",
  },
  {
    id: "city-transit",
    src: "/photos/report-city-transit.jpg",
    alt: "A busy urban corridor beneath elevated transport infrastructure.",
    caption:
      "Transit, density, congestion, and daily stress are judged as lived systems rather than abstract planning slogans.",
  },
];
