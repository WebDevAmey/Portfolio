import { nav, site } from "@/data/site";
import { DailyQuote } from "./daily-quote";
import { Icon } from "./icons";
import { LocalTime } from "./local-time";

const linkClass =
  "inline-flex min-h-9 items-center gap-1.5 text-[length:var(--step-small)] text-fg-2 transition-colors hover:text-fg hover:underline hover:underline-offset-4";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="column pt-14 sm:pt-20">
        <DailyQuote />

        <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-10 sm:grid-cols-3">
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
            <h2 className="mono-label mb-3">Contact</h2>
            <a href={`mailto:${site.email}`} className={`${linkClass} break-all`}>
              {site.email}
            </a>
            <p className="mt-2 text-[length:var(--step-small)] text-mute">
              {site.location} · <LocalTime /> IST
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line py-6">
          <p className="mono-label">
            © {new Date().getFullYear()} {site.name}
          </p>
          <a
            href="#top"
            className="mono-label inline-flex min-h-11 items-center gap-1.5 hover:text-fg"
          >
            Back to top
            <Icon name="arrow" className="-rotate-45" />
          </a>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="column-wide overflow-hidden text-center text-[clamp(3rem,14vw,8.5rem)] leading-[0.8] font-semibold tracking-[-0.05em] whitespace-nowrap text-fg/[0.06] select-none"
      >
        {site.name}
      </p>
    </footer>
  );
}
