import type { Locale } from "./types";

const cityTimeZones: Record<string, string> = {
  Bangkok: "Asia/Bangkok",
  Busan: "Asia/Seoul",
  Jeju: "Asia/Seoul",
  Taipei: "Asia/Taipei",
  Fukuoka: "Asia/Tokyo",
  Penang: "Asia/Kuala_Lumpur",
  Singapore: "Asia/Singapore",
  Shanghai: "Asia/Shanghai",
  Shenzhen: "Asia/Shanghai",
  Tianjin: "Asia/Shanghai",
  "Kuala Lumpur": "Asia/Kuala_Lumpur",
  Makati: "Asia/Manila",
  Jakarta: "Asia/Jakarta",
  Moscow: "Europe/Moscow",
  Istanbul: "Europe/Istanbul",
  Zurich: "Europe/Zurich",
  Vienna: "Europe/Vienna",
  Paris: "Europe/Paris",
  London: "Europe/London",
  "New York": "America/New_York",
  "San Francisco": "America/Los_Angeles",
};

const localeMap: Record<Locale, string> = {
  en: "en-GB",
  th: "th-TH",
  zh: "zh-CN",
};

export function resolveCityTimeZone(city: string): string | undefined {
  return cityTimeZones[city];
}

export function formatCityTime(now: Date, city: string, locale: Locale): string | null {
  const timeZone = resolveCityTimeZone(city);

  if (!timeZone) {
    return null;
  }

  return new Intl.DateTimeFormat(localeMap[locale], {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(now);
}
