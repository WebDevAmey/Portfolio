import { Icon } from "@/components/icons";
import { WorksFan } from "@/components/works-fan";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const selected = projects.filter((p) => p.featured);
const github = site.socials.find((s) => s.label === "GitHub");

export function Works() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="overflow-x-clip pb-[var(--section-y)]"
    >
      <div className="column mb-14 text-center">
        <p className="mono-label mb-3">01 · Selected work</p>
        <h2 id="work-title" className="section-title">
          A few things I&apos;ve built.
        </h2>
        <p className="mx-auto mt-3 max-w-[44ch] text-mute">
          From a growth platform for D2C founders to text effects and research agents. Tap a card to
          bring it forward.
        </p>
      </div>

      <WorksFan projects={selected} />

      {github && (
        <p className="mt-10 text-center">
          <a
            href={github.href}
            target="_blank"
            rel="noopener"
            className="mono-label inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 transition-colors hover:border-fg hover:text-fg"
          >
            More on GitHub
            <Icon name="arrow" />
          </a>
        </p>
      )}
    </section>
  );
}
