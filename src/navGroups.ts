import type { Locale, SitePath } from "./types";
import { getCopy } from "./siteCopy";

export type NavGroupId = "rankings" | "methodology" | "editorial" | "about";

export const navGroups: { id: NavGroupId; paths: SitePath[] }[] = [
  {
    id: "rankings",
    paths: ["/rankings", "/map", "/compare", "/side-by-side"],
  },
  {
    id: "methodology",
    paths: ["/methodology", "/data"],
  },
  {
    id: "editorial",
    paths: ["/essay", "/ideas", "/thailand"],
  },
  {
    id: "about",
    paths: ["/about-slic", "/history", "/awards"],
  },
];

export function navGroupLabel(groupId: NavGroupId, locale: Locale): string {
  return getCopy(locale).nav.groups[groupId];
}

export function navPathLabel(path: SitePath, locale: Locale): string {
  const copy = getCopy(locale);
  if (path === "/") return copy.nav.home;
  if (path === "/about-slic") return copy.nav.aboutSlic;
  if (path === "/rankings") return copy.nav.rankings;
  if (path === "/methodology") return copy.nav.methodology;
  if (path === "/data") return copy.nav.data;
  if (path === "/ideas") return copy.nav.ideas;
  if (path === "/essay") return copy.nav.essay;
  if (path === "/compare") return copy.nav.compare;
  if (path === "/side-by-side") return copy.nav.sideBySide;
  if (path === "/map") return copy.nav.map;
  if (path === "/history") return copy.nav.history;
  if (path === "/awards") return copy.nav.awards;
  return copy.nav.thailand;
}
