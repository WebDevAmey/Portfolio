"use client";

import { useEffect, useState } from "react";

const format = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** The current time in Pune. Empty on the server so the markup never mismatches. */
export function LocalTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(format.format(new Date()));
    tick();
    const timer = window.setInterval(tick, 15_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <time className="tabular-nums" aria-live="off">
      {time || "--:--"}
    </time>
  );
}
