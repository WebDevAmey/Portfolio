import { WorksBento } from "@/components/works-bento";
import { WorksRing } from "@/components/works-ring";
import { projects } from "@/data/projects";

export function Works() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="border-t border-line pt-[var(--section-y)]"
    >
      <div className="shell mb-10 flex flex-wrap items-end justify-between gap-6 lg:mb-0">
        <div>
          <p className="mono-label mb-4">01 · Selected work</p>
          <h2
            id="work-title"
            className="max-w-[16ch] text-[length:var(--step-3)] leading-[1.05] font-medium tracking-[-0.03em] [font-stretch:90%]"
          >
            Things I&apos;ve designed, built and shipped.
          </h2>
        </div>
        <p className="max-w-[34ch] text-[length:var(--step-0)] text-mute">
          From a growth platform for D2C founders to text effects, research agents and a Raft store
          written from scratch.
        </p>
      </div>

      {/* Ring on wide screens with a fine pointer; bento everywhere else. */}
      <div className="hidden lg:pointer-fine:block">
        <WorksRing projects={projects} />
      </div>
      <div className="pb-[var(--section-y)] lg:pointer-fine:hidden">
        <WorksBento projects={projects} />
      </div>
    </section>
  );
}
