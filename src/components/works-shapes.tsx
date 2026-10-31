import Link from "next/link";

import type { Project } from "@/data/projects";
import { ProjectThumb } from "./project-thumb";

/**
 * Every project gets its own silhouette. Each cell has the same footprint, so names line up
 * even though the shapes differ; the shape sits centred inside it.
 */
const shapes = [
  { label: "arch", className: "h-full aspect-[4/5] rounded-t-full rounded-b-[1.25rem]" },
  { label: "circle", className: "h-[86%] aspect-square rounded-full" },
  { label: "pill", className: "w-full aspect-[2/1] rounded-full" },
  { label: "leaf", className: "h-[88%] aspect-square rounded-[999px_0]" },
  {
    label: "tilted",
    className: "w-[86%] aspect-[4/3] rounded-[2rem] -rotate-3 group-hover:rotate-0",
  },
  {
    label: "pebble",
    className: "h-[88%] aspect-square rounded-[42%_58%_63%_37%/41%_44%_56%_59%]",
  },
];

export function WorksShapes({ projects }: { projects: Project[] }) {
  return (
    <ul className="column-wide grid grid-cols-1 gap-x-8 gap-y-14 min-[480px]:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, i) => {
        const shape = shapes[i % shapes.length];
        return (
          <li key={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="grid aspect-[5/4] w-full place-items-center">
                <ProjectThumb
                  project={project}
                  sizes="(min-width: 1024px) 320px, (min-width: 480px) 45vw, 90vw"
                  showName={false}
                  className={`border border-line bg-surface shadow-[0_18px_40px_-28px_rgba(0,0,0,0.5)] grayscale transition-[filter,transform,box-shadow] duration-[var(--dur-slow)] ease-out group-hover:scale-[1.03] group-hover:shadow-[0_24px_50px_-26px_rgba(0,0,0,0.55)] group-hover:grayscale-0 group-focus-visible:grayscale-0 motion-reduce:group-hover:scale-100 ${shape.className}`}
                />
              </div>
              <h3 className="mt-5 text-[length:var(--step-1)] font-semibold tracking-[-0.01em] underline-offset-4 group-hover:underline">
                {project.name}
              </h3>
              <p className="mono-label mt-1">{project.kind}</p>
              <p className="mt-2 max-w-[30ch] text-[length:var(--step-small)] text-mute">
                {project.summary}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
