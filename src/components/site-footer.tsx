"use client";

import { useState, useSyncExternalStore } from "react";

import { nav, site } from "@/data/site";
import { DailyQuote } from "./daily-quote";
import { Icon } from "./icons";
import { LocalTime } from "./local-time";
import { MeadowScene } from "./meadow-scene";

const isNightNow = () => {
  const hour = new Date().getHours();
  return hour < 6 || hour >= 19;
};

const subscribeNever = () => () => {};

const linkClass =
  "inline-flex min-h-9 items-center gap-1.5 text-[length:var(--step-small)] text-[var(--on-sky)] transition-opacity hover:opacity-70";

/**
 * A meadow under the visitor's own sky: day or night follows their local clock, and the
 * sun/moon button flips it. Colours are registered custom properties, so they crossfade.
 */
export function SiteFooter() {
  // The server always renders day; the client reads the visitor's clock once it hydrates.
  const nightByClock = useSyncExternalStore(subscribeNever, isNightNow, () => false);
  const [override, setOverride] = useState<boolean | null>(null);
  const night = override ?? nightByClock;

  return (
    <footer className="meadow relative overflow-hidden" data-night={night}>
      <div
        className="meadow-stars meadow-night pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      <div className="column-wide relative grid gap-12 pt-16 pb-4 sm:pt-20 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <DailyQuote />

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-[auto_auto_1fr] sm:gap-x-10">
          <nav aria-label="Footer">
            <h2 className="mono-label mb-3">Navigate</h2>
            <ul>
              {nav.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    {...("external" in item ? { target: "_blank", rel: "noopener" } : {})}
                    className={linkClass}
                  >
                    {item.label}
                    {"external" in item && <Icon name="arrow" className="text-[0.85em]" />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="mono-label mb-3">Elsewhere</h2>
            <ul>
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener me" className={linkClass}>
                    {s.label}
                    <Icon name="arrow" className="text-[0.85em]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h2 className="mono-label mb-3">Say hi</h2>
            <a href={`mailto:${site.email}`} className={`${linkClass} [overflow-wrap:anywhere]`}>
              {site.email}
            </a>
            <p className="mt-1 text-[length:var(--step-small)] text-mute">
              Pune · <LocalTime /> IST
            </p>
          </div>
        </div>
      </div>

      <div className="relative -mt-10 h-[13rem] sm:-mt-[10vw] sm:h-auto">
        <MeadowScene />
      </div>

      <div className="meadow-bar relative">
        <div className="column-wide flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4 text-[length:var(--step-small)]">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <div className="flex items-center gap-1">
            <a
              href="#top"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 hover:bg-white/10"
            >
              Back to top
              <Icon name="arrow" className="-rotate-45" />
            </a>
            <button
              type="button"
              onClick={() => setOverride(!night)}
              aria-pressed={night}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 hover:bg-white/10"
            >
              <Icon name={night ? "moon" : "sun"} />
              Night sky
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
