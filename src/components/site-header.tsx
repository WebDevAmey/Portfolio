import Link from "next/link";

import { nav, site } from "@/data/site";
import { Icon, Mark } from "./icons";

/** A small floating pill bar, centred like the rest of the page. */
export function SiteHeader() {
  return (
    <header className="sticky top-3 z-50 flex justify-center px-3 pt-3 sm:top-4">
      <nav
        aria-label="Primary"
        className="flex h-[var(--nav-h)] items-center gap-1 rounded-full border border-line bg-surface/80 p-1 shadow-[0_6px_24px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md"
      >
        <Link
          href="/"
          aria-label={`${site.name}, home`}
          className="grid size-10 place-items-center rounded-full bg-fg text-[15px] text-bg transition-transform duration-[var(--dur-base)] ease-squish hover:-rotate-12"
        >
          <Mark />
        </Link>
        <ul className="flex items-center">
          {nav.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                {...("external" in item ? { target: "_blank", rel: "noopener" } : {})}
                className="inline-flex h-10 items-center gap-1 rounded-full px-3 text-[length:var(--step-small)] text-mute transition-colors duration-[var(--dur-base)] hover:bg-chip hover:text-fg sm:px-3.5"
              >
                {item.label}
                {"external" in item && (
                  <Icon name="arrow" className="hidden text-[0.85em] sm:block" />
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
