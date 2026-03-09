import { useEffect, useState } from "react";

const clockZones = [
  { label: "UTC", timeZone: "UTC" },
  { label: "Bangkok", timeZone: "Asia/Bangkok" },
  { label: "Singapore", timeZone: "Asia/Singapore" },
  { label: "Taipei", timeZone: "Asia/Taipei" },
  { label: "Tokyo", timeZone: "Asia/Tokyo" },
  { label: "Dubai", timeZone: "Asia/Dubai" },
  { label: "Moscow", timeZone: "Europe/Moscow" },
  { label: "Istanbul", timeZone: "Europe/Istanbul" },
  { label: "Zurich", timeZone: "Europe/Zurich" },
  { label: "London", timeZone: "Europe/London" },
  { label: "New York", timeZone: "America/New_York" },
  { label: "San Francisco", timeZone: "America/Los_Angeles" },
];

function formatClock(now: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(now);
}

export default function ClockRail() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="clock-rail" aria-label="World clocks">
      {clockZones.map((zone) => (
        <article className="clock-rail-item" key={zone.timeZone}>
          <span>{zone.label}</span>
          <strong>{formatClock(now, zone.timeZone)}</strong>
        </article>
      ))}
    </div>
  );
}
