"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { WorksRing } from "@/components/WorksRing";

import {
  type TechIcon,
  type TechKey,
  type TechItem,
  type Project,
  iconMap,
  techNames,
  projectsData,
} from "@/data/projectsData";

export {
  type TechIcon,
  type TechKey,
  type TechItem,
  type Project,
  iconMap,
  techNames,
  projectsData,
};

const ArrowUpRight = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

const GithubMark = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

const textLinkClass =
  "relative z-30 inline-flex items-center gap-1 rounded-sm text-[12px] font-medium text-zinc-500 underline-offset-4 transition-colors hover:text-orange-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40 dark:text-zinc-400 dark:hover:text-orange-400 dark:focus-visible:ring-white/40";

// Title that rolls up to an accent copy on hover. Screen readers get the plain title.
const RollingTitle = ({ text }: { text: string }) => (
  <span className="relative inline-block overflow-hidden align-bottom leading-[1.35]">
    <span aria-hidden="true" className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full group-focus-within:-translate-y-full motion-reduce:transition-none">
      {text}
    </span>
    <span aria-hidden="true" className="absolute inset-0 block translate-y-full text-orange-600 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-within:translate-y-0 motion-reduce:transition-none dark:text-orange-400">
      {text}
    </span>
    <span className="sr-only">{text}</span>
  </span>
);

export const ProjectCard = ({
  project,
  index,
  setActiveVideo,
  isPriority = false,
}: {
  project: Project;
  index: number;
  setActiveVideo: (v: string) => void;
  isPriority?: boolean;
}) => {
  // Light/dark screenshots are switched with CSS so server and client markup match.
  const imageClass =
    "size-full object-cover object-left-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100";

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md bg-zinc-100 ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
        {project.lightModeSrc && (
          <Image
            src={project.lightModeSrc}
            alt={`${project.title}: ${project.imageTitle}`}
            fill
            preload={isPriority}
            sizes="(min-width: 768px) 40vw, calc(100vw - 2rem)"
            quality={80}
            className={`${imageClass} dark:hidden`}
          />
        )}
        <Image
          src={project.src}
          alt={`${project.title}: ${project.imageTitle}`}
          fill
          preload={isPriority}
          sizes="(min-width: 768px) 40vw, calc(100vw - 2rem)"
          quality={80}
          className={`${imageClass} ${project.lightModeSrc ? "hidden dark:block" : ""}`}
        />

        {project.video && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <button
              type="button"
              aria-label={`Play ${project.title} video`}
              className="pointer-events-auto opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 focus-visible:opacity-100 focus-visible:scale-100 transition-[opacity,transform] h-10 w-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg cursor-pointer active:scale-95 border border-white/50"
              onClick={() => {
                if (project.video) setActiveVideo(project.video);
              }}
            >
              <svg className="w-4 h-4 text-zinc-900 ml-0.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5.25 5.653v12.694c0 .856.926 1.39 1.668.958l11.1-6.347a1.125 1.125 0 000-1.916L6.918 4.695c-.742-.432-1.668.102-1.668.958z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h3 className="text-[17px] font-medium tracking-[-0.02em] text-zinc-900 dark:text-zinc-100">
          {/* Stretched link: the whole card opens the project page */}
          <Link
            href={`/projects/${project.slug}`}
            className="rounded-sm after:absolute after:inset-0 after:z-20 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40 dark:focus-visible:ring-white/40"
          >
            <RollingTitle text={project.title} />
          </Link>
        </h3>
        <span aria-hidden="true" className="font-mono text-[13px] font-medium tracking-[-0.03em] text-zinc-400 dark:text-zinc-500">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <p className="mt-1 text-[13px] font-medium leading-relaxed tracking-[-0.01em] text-zinc-500 dark:text-zinc-400">
        {project.description}
      </p>
      {project.credit && (
        <p className="mt-1 text-[12px] italic text-zinc-400 dark:text-zinc-500">{project.credit}</p>
      )}

      {(project.live || project.github) && (
        <div className="mt-2.5 flex items-center gap-4">
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
              Live Demo
              <ArrowUpRight />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
              <GithubMark className="w-3 h-3" />
              GitHub
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>
      )}
    </article>
  );
};

export function ProjectList({
  projects,
  setActiveVideo,
}: {
  projects: Project[];
  setActiveVideo: (v: string) => void;
}) {
  return (
    <ul className="relative z-10 flex w-full flex-col gap-12">
      {projects.map((project, index) => (
        <li key={project.slug}>
          <ProjectCard
            project={project}
            index={index}
            setActiveVideo={setActiveVideo}
            isPriority={index === 0}
          />
        </li>
      ))}
    </ul>
  );
}

export function ProjectsGrid() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <WorksRing projects={projectsData.slice(0, 4)} minCards={8} className="hidden h-[420px] md:block" />
      <div className="md:hidden">
        <ProjectList projects={projectsData.slice(0, 4)} setActiveVideo={setActiveVideo} />
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Project video"
              className="relative bg-black rounded-xl overflow-hidden w-[90%] max-w-3xl shadow-2xl"
            >
              <button
                type="button"
                aria-label="Close video"
                onClick={() => setActiveVideo(null)}
                className="absolute top-3 right-3 p-2 bg-neutral-800/80 hover:bg-neutral-700 rounded-full cursor-pointer transition-colors z-50"
              >
                <X size={20} className="text-neutral-200" />
              </button>

              {activeVideo.includes("youtube") ? (
                <iframe
                  src={activeVideo}
                  className="w-full aspect-video border-0"
                  allowFullScreen
                ></iframe>
              ) : (
                <video src={activeVideo} className="w-full h-auto" controls autoPlay />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
