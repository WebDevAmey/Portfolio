import { site } from "@/data/site";
import { DailyQuote } from "./daily-quote";
import { Icon } from "./icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="shell grid gap-16 py-16 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:py-24">
        <DailyQuote />
        <div className="flex flex-col justify-between gap-12">
          <ul className="grid gap-1" aria-label="Elsewhere">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener me"
                  className="group flex min-h-11 items-center justify-between gap-4 border-b border-line py-2 transition-colors hover:border-cobalt-bright"
                >
                  <span>{s.label}</span>
                  <span className="flex items-center gap-2 font-mono text-[length:var(--step-0)] text-mute transition-colors group-hover:text-paper">
                    {s.handle}
                    <Icon name="arrow" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mono-label leading-relaxed">
            © {new Date().getFullYear()} {site.name}
            <br />
            Designed and built in {site.location}
          </p>
        </div>
      </div>
    </footer>
  );
}
