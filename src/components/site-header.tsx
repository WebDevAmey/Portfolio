import Link from "next/link";

import { nav, site } from "@/data/site";
import { Icon, Mark } from "./icons";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/75 backdrop-blur-md supports-[not(backdrop-filter:blur(1px))]:bg-ink">
      <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex min-h-11 items-center gap-2.5 font-medium tracking-[-0.02em]"
        >
          <span className="grid size-7 place-items-center rounded-[7px] bg-cobalt text-[13px] text-paper transition-transform duration-[var(--dur-base)] ease-squish group-hover:-rotate-6">
            <Mark />
          </span>
          <span>
            {site.shortName}
            <span className="hidden text-mute sm:inline"> Tarmale</span>
          </span>
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center text-[13px] sm:gap-2 sm:text-[length:var(--step-0)]">
            {nav.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  {...("external" in item ? { target: "_blank", rel: "noopener" } : {})}
                  className="inline-flex min-h-11 items-center gap-1 rounded-full px-1.5 text-mute transition-colors hover:text-paper sm:px-3"
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
      </div>
    </header>
  );
}
