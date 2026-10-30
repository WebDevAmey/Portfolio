import Link from "next/link";

import type { Project } from "@/data/projects";
import { Icon } from "./icons";
import { ProjectThumb } from "./project-thumb";

// Asymmetric rhythm for the featured tiles on a two-column grid.
const spans = ["sm:col-span-2", "", "", "sm:col-span-2", "", ""];

export function WorksBento({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <div className="shell">
      <ul className="grid gap-3 sm:grid-cols-2">
        {featured.map((project, i) => (
          <li key={project.slug} className={spans[i % spans.length]}>
            <Link
              href={`/projects/${project.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-ink-2 transition-colors hover:border-line-strong"
            >
              <ProjectThumb
                project={project}
                sizes="(min-width: 640px) 50vw, 100vw"
                showName={false}
                className="aspect-[16/10] w-full"
              />
              <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[length:var(--step-2)] leading-tight font-medium tracking-[-0.02em] font-display">
                    {project.name}
                  </h3>
                  <span className="mono-label">{project.kind}</span>
                </div>
                <p className="text-[length:var(--step-0)] text-mute">{project.summary}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <h3 className="mono-label mt-16 mb-4">More work</h3>
      <ul className="border-t border-line">
        {rest.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              className="group grid min-h-11 grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-line py-4"
            >
              <span className="font-medium">{project.name}</span>
              <Icon
                name="arrowRight"
                className="row-span-2 text-mute transition-transform duration-[var(--dur-base)] group-hover:translate-x-1 group-hover:text-paper"
              />
              <span className="text-[length:var(--step-0)] text-mute">{project.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
