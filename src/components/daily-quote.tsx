"use client";

import { useEffect, useState } from "react";

import quotes from "@/data/quotes.json";
import {
  getDayOfYear,
  getQuoteForDate,
  isLeapYear,
  msUntilNextMidnight,
  type Quote,
} from "@/lib/quotes";

// Fire slightly after midnight so the new date is unambiguous.
const MIDNIGHT_SLACK_MS = 250;
const WORD_STAGGER_MS = 28;

type Today = { quote: Quote; day: number; daysInYear: number };

const readToday = (): Today => {
  const now = new Date();
  return {
    quote: getQuoteForDate(now, quotes),
    day: getDayOfYear(now),
    daysInYear: isLeapYear(now.getFullYear()) ? 366 : 365,
  };
};

/**
 * Rendered on the client only, because the quote depends on the visitor's local date.
 * The box reserves its final height on the server, so filling it in never shifts layout.
 */
export function DailyQuote() {
  const [today, setToday] = useState<Today | null>(null);

  useEffect(() => {
    let timer = 0;
    const refresh = () => {
      setToday((prev) => {
        const next = readToday();
        return prev?.day === next.day ? prev : next;
      });
      window.clearTimeout(timer);
      timer = window.setTimeout(refresh, msUntilNextMidnight(new Date()) + MIDNIGHT_SLACK_MS);
    };
    // Background tabs throttle timers, so re-check whenever the page becomes visible again.
    const onVisible = () => {
      if (!document.hidden) refresh();
    };
    refresh();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <figure className="flex flex-col gap-5" aria-labelledby="quote-label">
      <p id="quote-label" className="mono-label flex items-center gap-3">
        <span className="size-1.5 rounded-full bg-fg" aria-hidden="true" />
        Line of the day
        <span className="tabular-nums" aria-hidden={!today}>
          {today ? `${String(today.day).padStart(3, "0")} / ${today.daysInYear}` : " "}
        </span>
      </p>
      <div className="min-h-[calc(5lh+2.25rem)] text-[length:var(--step-2)] leading-[1.35] sm:min-h-[calc(3lh+2.25rem)]">
        {today && (
          <div key={today.quote.id} aria-live="polite">
            <blockquote className="font-medium tracking-[-0.015em] text-balance">
              <p>
                {today.quote.text.split(" ").map((word, i) => (
                  <span
                    key={i}
                    className="quote-word inline-block"
                    style={{ animationDelay: `${i * WORD_STAGGER_MS}ms` }}
                  >
                    {word}
                    {" "}
                  </span>
                ))}
              </p>
            </blockquote>
            <figcaption
              className="quote-word mt-4 font-mono text-[length:var(--step-small)] text-mute"
              style={{
                animationDelay: `${today.quote.text.split(" ").length * WORD_STAGGER_MS}ms`,
              }}
            >
              {today.quote.author}
            </figcaption>
          </div>
        )}
      </div>
    </figure>
  );
}
