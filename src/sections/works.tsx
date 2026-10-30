import { WorksBento } from "@/components/works-bento";
import { WorksStage } from "@/components/works-stage";
import { projects } from "@/data/projects";

export function Works() {
  return (
    <section id="work" aria-labelledby="work-title" className="pb-[var(--section-y)]">
      <div className="column mb-10 lg:pointer-fine:mb-0">
        <p className="mono-label mb-3">01 · Selected work</p>
        <h2 id="work-title" className="section-title">
          Things I&apos;ve designed, built and shipped.
        </h2>
        <p className="mt-3 text-mute">
          From a growth platform for D2C founders to text effects, research agents and a Raft store
          written from scratch.
        </p>
      </div>

      {/* Ring on wide screens with a fine pointer; bento everywhere else. */}
      <WorksStage projects={projects} />
      <div className="lg:pointer-fine:hidden">
        <WorksBento projects={projects} />
      </div>
    </section>
  );
}
