"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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

const actionLinkClass =
  "relative z-30 inline-flex items-center gap-1.5 rounded-md border border-black/10 bg-white px-2.5 py-1 text-[12px] font-medium text-zinc-700 shadow-sm transition-colors hover:border-black/20 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white dark:focus-visible:ring-white/40";

export const ProjectCard = ({
  project,
  setActiveVideo,
  isPriority = false,
}: {
  project: Project;
  setActiveVideo: (v: string) => void;
  isPriority?: boolean;
}) => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  // Light/dark screenshots are switched with CSS so server and client markup match.

  return (
    <article className="relative flex flex-col group">
      <div
        className="relative w-full aspect-[1.25] rounded-xl border border-black/5 dark:border-white/5 bg-zinc-50/80 dark:bg-[#09090b]/80 shadow-sm p-3.5 pb-0 flex flex-col overflow-hidden transition-[border-color,box-shadow] duration-200 group-hover:shadow-md group-hover:border-black/10 dark:group-hover:border-white/10 group-focus-within:border-black/15 dark:group-focus-within:border-white/15 sm:aspect-[1.4] sm:p-4 sm:pb-0"
      >
        <div className="flex items-center justify-between z-10 min-h-[24px]">
          {project.hasPin ? (
            <span className="inline-flex items-center gap-1 rounded-[6px] border border-zinc-200/80 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-400">
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 17v5" /><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
              </svg>
              Featured
            </span>
          ) : <span />}
        </div>

        {/* Ambient Hover Background */}
        {project.backgroundImage && (
          <div className="absolute inset-0 scale-100 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:scale-[1.03] group-hover:opacity-100 motion-reduce:transition-none">
            <Image
              src={project.backgroundImage}
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 768px) 320px, calc(100vw - 2rem)"
              quality={70}
              className="object-cover"
            />
          </div>
        )}

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

        {/* Floating screenshot sitting directly at the bottom of the outer wrapper */}
        <div
          className="absolute bottom-0 left-1/2 z-20 h-[78%] w-[85%] origin-bottom rounded-t-[10px] border border-b-0 border-black/5 bg-white p-0 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] dark:border-white/[0.15] dark:bg-[#0a0a0a] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)] -translate-x-1/2 transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:transform-none"
        >
          <div className="size-full overflow-hidden rounded-t-[9px]">
            {project.lightModeSrc && (
              <Image
                src={project.lightModeSrc}
                alt={`${project.title}: ${project.imageTitle}`}
                width={600}
                height={400}
                preload={isPriority}
                sizes="(min-width: 768px) 17vw, calc(100vw - 2rem)"
                quality={70}
                className="size-full object-cover object-left-top dark:hidden"
              />
            )}
            <Image
              src={project.src}
              alt={`${project.title}: ${project.imageTitle}`}
              width={600}
              height={400}
              preload={isPriority}
              sizes="(min-width: 768px) 17vw, calc(100vw - 2rem)"
              quality={70}
              className={`size-full object-cover object-left-top ${project.lightModeSrc ? "hidden dark:block" : ""}`}
            />
          </div>
        </div>
      </div>

      {/* Content Area directly below the wrapper */}
      <div className="mt-4 flex flex-col px-0.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
            {/* Stretched link: the whole card opens the project page */}
            <Link
              href={`/projects/${project.slug}`}
              className="rounded-sm after:absolute after:inset-0 after:z-20 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40 dark:focus-visible:ring-white/40"
            >
              {project.title}
            </Link>
          </h3>

          {project.live && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 w-fit shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">Live</span>
            </span>
          )}
        </div>

        <p className="mt-2 sm:mt-1.5 text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed pr-2">
          {project.description}
        </p>
        {project.credit && (
          <p className="mt-1.5 text-[12px] italic text-zinc-500 dark:text-zinc-500">{project.credit}</p>
        )}

        <ul className="flex gap-2 flex-wrap items-center mt-3" aria-label={`${project.title} tech stack`}>
          {project.tech.map((item) => {
            const key = typeof item === "string" ? item : item.label;
            const isIconItem = typeof item === "string";
            const tooltipText = isIconItem ? techNames[item] : item.tooltip || item.label;
            const uniqueId = `${project.title}-${key}`;

            return (
              <li
                key={key}
                className="relative z-30"
                onMouseEnter={() => setHoveredTech(uniqueId)}
                onMouseLeave={() => setHoveredTech(null)}
              >
                {isIconItem ? (
                  (() => {
                    const TechIcon = iconMap[item];
                    return (
                      <>
                        <TechIcon className="w-4 h-4 md:w-3.5 md:h-3.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors" />
                        <span className="sr-only">{tooltipText}</span>
                      </>
                    );
                  })()
                ) : (
                  <span className="px-1.5 py-0.5 rounded border border-black/20 dark:border-white/[0.15] text-[10px] text-zinc-600 dark:text-zinc-400 leading-none">
                    {item.label}
                  </span>
                )}
                <AnimatePresence>
                  {hoveredTech === uniqueId && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      aria-hidden="true"
                      className="absolute -top-7 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                    >
                      <div className="bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-[10px] px-2 py-0.5 rounded shadow-xl whitespace-nowrap">
                        {tooltipText}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className={actionLinkClass}>
              Live Demo
              <ArrowUpRight />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className={actionLinkClass}>
              <GithubMark />
              GitHub
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
          <span className="ml-auto inline-flex size-6 items-center justify-center rounded-md text-zinc-400 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-900 dark:text-zinc-500 dark:group-hover:text-zinc-100 motion-reduce:transform-none" aria-hidden="true">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};

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
      <div className="flex flex-col relative z-10 w-full">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 md:gap-y-0 pb-10 md:pb-6">
          {projectsData.slice(0, 2).map((project) => (
            <ProjectCard key={project.title} project={project} setActiveVideo={setActiveVideo} />
          ))}
        </div>

        {/* Middle Horizontal Line Container */}
        <div className="relative w-full h-0 hidden md:block">
          <div className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
          {/* Intersections */}
          <div className="absolute top-0 -left-4 w-[2px] h-[2px] bg-black/40 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
          <div className="absolute top-0 -right-4 w-[2px] h-[2px] bg-black/40 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
          <div className="absolute top-0 left-1/2 w-[2px] h-[2px] bg-black/40 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 md:gap-y-0 pt-0 md:pt-6">
          {projectsData.slice(2, 4).map((project) => (
            <ProjectCard key={project.title} project={project} setActiveVideo={setActiveVideo} />
          ))}
        </div>
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
