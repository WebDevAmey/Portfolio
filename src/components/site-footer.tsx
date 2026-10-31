"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { projects } from "@/data/projects";
import { nav, site } from "@/data/site";
import { Icon, Mark, type IconName } from "./icons";
import { LocalTime } from "./local-time";
import { MeadowScene } from "./meadow-scene";

const isNightNow = () => {
  const hour = new Date().getHours();
  return hour < 6 || hour >= 19;
};

const subscribeNever = () => () => {};

const socialIcons: Record<string, IconName> = { GitHub: "brackets", X: "xLogo" };

const linkClass =
  "inline-flex min-h-9 items-center gap-1.5 text-[length:var(--step-small)] text-[var(--on-sky-mute)] transition-colors hover:text-[var(--on-sky)]";

const columns = [
  {
    title: "Navigate",
    links: nav.map((n) => ({ label: n.label, href: n.href, external: "external" in n })),
  },
  {
    title: "Work",
    links: projects
      .filter((p) => p.featured)
      .slice(0, 4)
      .map((p) => ({ label: p.name, href: `/projects/${p.slug}`, external: false })),
  },
  {
    title: "Elsewhere",
    links: site.socials.map((s) => ({ label: s.label, href: s.href, external: true })),
  },
];

/**
 * A light footer that opens onto a meadow. The huge name rises from behind the hills when the
 * footer scrolls into view; day or night follows the visitor's clock, with a toggle to flip it.
 */
export function SiteFooter() {
  const nightByClock = useSyncExternalStore(subscribeNever, isNightNow, () => false);
  const [override, setOverride] = useState<boolean | null>(null);
  const night = override ?? nightByClock;

  // null until observed, so without JS the name simply sits in place.
  const [risen, setRisen] = useState<boolean | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRisen(true);
          io.disconnect();
        } else {
          setRisen(false);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <footer
      className="meadow relative overflow-hidden"
      data-night={night}
      data-risen={risen ?? undefined}
    >
      <div
        className="meadow-stars meadow-night pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      <div className="column-wide relative grid gap-12 pt-16 sm:pt-24 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16">
        <div className="max-w-[22rem]">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5"
            aria-label={`${site.name}, home`}
          >
            <span className="grid size-8 place-items-center rounded-[0.6rem] bg-[var(--on-sky)] text-[13px] text-[var(--sky-top)]">
              <Mark />
            </span>
            <span className="text-[length:var(--step-1)] font-semibold tracking-[-0.01em]">
              {site.name}
            </span>
          </Link>
          <p className="mt-4 text-[length:var(--step-small)] leading-relaxed text-[var(--on-sky)]">
            Building OVRT and small, careful tools for the web, one commit at a time from Pune.
          </p>
          <ul className="mt-6 flex items-center gap-1" aria-label="Social links">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener me"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full text-[var(--on-sky)] transition-colors hover:bg-[var(--chip-on-sky)]"
                >
                  {socialIcons[s.label] ? (
                    <Icon name={socialIcons[s.label]} className="text-[17px]" strokeWidth={2} />
                  ) : (
                    <span className="text-[15px] font-bold tracking-[-0.04em]">in</span>
                  )}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${site.email}`}
                aria-label={`Email ${site.email}`}
                className="grid size-10 place-items-center rounded-full text-[var(--on-sky)] transition-colors hover:bg-[var(--chip-on-sky)]"
              >
                <Icon name="mail" className="text-[17px]" strokeWidth={2} />
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3 lg:gap-x-16">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="mb-3 text-[length:var(--step-small)] font-semibold text-[var(--on-sky)]">
                  {col.title}
                </h2>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        {...(l.external ? { target: "_blank", rel: "noopener" } : {})}
                        className={linkClass}
                      >
                        {l.label}
                        {l.external && <Icon name="arrow" className="text-[0.8em]" />}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-1 text-[length:var(--step-small)] text-[var(--on-sky)]">
            <p className="font-medium">
              © {new Date().getFullYear()} {site.name}.
            </p>
            <p className="text-[var(--on-sky-mute)]">
              Pune · <LocalTime /> IST
            </p>
            <button
              type="button"
              onClick={() => setOverride(!night)}
              aria-pressed={night}
              className="-ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-[var(--on-sky-mute)] transition-colors hover:text-[var(--on-sky)]"
            >
              <Icon name={night ? "moon" : "sun"} />
              Night sky
            </button>
            <a
              href="#top"
              className="-ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-[var(--on-sky-mute)] transition-colors hover:text-[var(--on-sky)]"
            >
              Back to top
              <Icon name="arrow" className="-rotate-45" />
            </a>
          </div>
        </div>
      </div>

      <div ref={sceneRef} className="relative -mt-4 h-[12rem] sm:-mt-[9vw] sm:h-auto">
        <MeadowScene />
      </div>
    </footer>
  );
}
