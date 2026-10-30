import Image from "next/image";
import { ViewTransition } from "react";

import type { Project } from "@/data/projects";
import { getProjectArt } from "@/lib/project-art";

type ProjectThumbProps = {
  project: Project;
  sizes: string;
  priority?: boolean;
  /** Show the project name on generated art (off where a caption already names it). */
  showName?: boolean;
  className?: string;
};

function GeneratedArt({ project, showName }: { project: Project; showName: boolean }) {
  const art = getProjectArt(project.slug);
  return (
    <div
      role="img"
      aria-label={`${project.name} cover`}
      className="relative size-full overflow-hidden bg-ink-2"
      style={{
        backgroundImage: `radial-gradient(120% 90% at ${art.glowX}% ${art.glowY}%, color-mix(in srgb, var(--cobalt) 70%, transparent), transparent 62%), repeating-linear-gradient(${art.angle}deg, var(--line) 0 1px, transparent 1px 22px)`,
      }}
    >
      <svg
        viewBox="0 0 100 62.5"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full text-paper/25"
        aria-hidden="true"
      >
        {art.mark === 0 && (
          <circle cx="50" cy="31" r="20" fill="none" stroke="currentColor" strokeWidth="0.4" />
        )}
        {art.mark === 1 && (
          <path
            d="M30 50 L50 12 L70 50 M38 36 H62"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
          />
        )}
        {art.mark === 2 && (
          <rect
            x="32"
            y="13"
            width="36"
            height="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
            transform="rotate(45 50 31)"
          />
        )}
        <circle cx={art.sparkX} cy={art.sparkY * 0.625} r="1.1" fill="var(--lime)" />
      </svg>
      {showName && (
        <span className="absolute bottom-[8%] left-[7%] text-[clamp(1rem,4cqw+0.4rem,2.75rem)] font-semibold tracking-[-0.03em] text-paper [font-stretch:85%]">
          {project.name}
        </span>
      )}
    </div>
  );
}

export function ProjectThumb({
  project,
  sizes,
  priority,
  showName = true,
  className = "",
}: ProjectThumbProps) {
  return (
    <ViewTransition name={`thumb-${project.slug}`} share="thumb">
      <div className={`[container-type:inline-size] relative overflow-hidden ${className}`}>
        {project.image ? (
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            sizes={sizes}
            priority={priority}
            draggable={false}
            className="size-full object-cover object-left-top"
          />
        ) : (
          <GeneratedArt project={project} showName={showName} />
        )}
      </div>
    </ViewTransition>
  );
}
