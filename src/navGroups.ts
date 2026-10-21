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
    paths: ["/about-slic", "/history", "/awards", "/traffic"],
  },
];

export function navGroupLabel(groupId: NavGroupId, locale: Locale): string {
  return getCopy(locale).nav.groups[groupId];
}

export type NavGroupEntry = {
  path: SitePath;
  label: string;
};

export type NavGroupEntries = {
  /** The heading of the group. */
  label: string;
  /** The path the heading itself points at, when a link repeats the heading. */
  headingPath: SitePath | null;
  /** The links that belong under the heading. */
  items: NavGroupEntry[];
};

/**
 * A group's heading, and the links that belong under it.
 *
 * Two groups repeat themselves: the heading "Rankings" is also the link to the
 * rankings page, and the heading "Methodology" is also the link to the
 * methodology page. A sitemap that prints the same word twice — once as a
 * heading, once as its own first entry — reads as a mistake.
 *
 * So when the heading matches one of its own links, the heading becomes that
 * link and the duplicate disappears. Nothing is renamed, nothing is invented,
 * no page is lost, and the word is printed once. The test is a string
 * comparison, so it holds in every language: the Thai "การจัดอันดับ" and the
 * Japanese "ランキング" absorb their twins exactly as the English ones do.
 */
export function navGroupEntries(groupId: NavGroupId, locale: Locale): NavGroupEntries {
  const group = navGroups.find((candidate) => candidate.id === groupId);
  const label = navGroupLabel(groupId, locale);
  const items: NavGroupEntry[] = (group?.paths ?? []).map((path) => ({
    path,
    label: navPathLabel(path, locale),
  }));
  const twin = items.find((item) => item.label === label);

  return {
    label,
    headingPath: twin ? twin.path : null,
    items: twin ? items.filter((item) => item.path !== twin.path) : items,
  };
}

export function navPathLabel(path: SitePath, locale: Locale): string {
  if (path === "/traffic") return { en: "Worldwide reach", th: "การเข้าชมทั่วโลก", zh: "全球访问", ko: "전 세계 방문", ja: "世界からのアクセス" }[locale];
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
