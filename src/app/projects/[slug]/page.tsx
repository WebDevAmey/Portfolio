import { ThemeToggle } from "@/components/theme-toggle";
import { CommandMenu } from "@/components/command-menu";
import { CurrentTime } from "@/components/CurrentTime";
import { RightNavbar } from "@/components/RightNavbar";
import { FooterBackground } from "@/components/FooterBackground";
import { projectsData, iconMap, techNames, TechItem, TechKey } from "@/data/projectsData";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { SiGithub } from "react-icons/si";

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);
  if (!project) return { title: "Project | Amey Tarmale" };
  return {
    title: `${project.title} | Amey Tarmale`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black relative overflow-x-hidden transition-colors duration-300">
      {/* Right Side Blueprint Navigation */}
      <RightNavbar />

      {/* Vertical Lines - Ultra-fine Micro Dots */}
      <div className="absolute top-0 bottom-0 left-[30%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none hidden md:block" style={{ maskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)' }} />
      <div className="absolute top-0 bottom-0 right-[30%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none hidden md:block" style={{ maskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)' }} />

      {/* Horizontal Lines - Ultra-fine Micro Dots */}
      <div className="absolute left-0 right-0 top-[22vh] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
      <div className="absolute left-0 right-0 top-[calc(22vh+112px)] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />

      {/* Ultra-Tiny Solid Nodes */}
      {[
        { top: '22vh', left: '30%' },
        { top: '22vh', right: '30%' },
        { top: 'calc(22vh + 112px)', left: '30%' },
        { top: 'calc(22vh + 112px)', right: '30%' },
      ].map((pos, i) => (
        <div key={i} className="absolute w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] pointer-events-none z-10 hidden md:block"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            transform: `translate(${pos.right ? '50%' : '-50%'}, -50%)`
          }} />
      ))}

      {/* Cell 1: Dot Matrix Background */}
      <div className="absolute left-0 right-0 md:left-[30%] md:right-[30%] top-0 h-[22vh] -z-0 pointer-events-auto">
        <FooterBackground />
        <div className="absolute bottom-3 right-2 z-10 pointer-events-auto">
          <CurrentTime />
        </div>
      </div>

      {/* Cell 2: Header with Back Button + Title + Controls */}
      <div className="absolute left-0 right-0 md:left-[30%] md:right-[30%] top-[22vh] h-[112px] flex items-center px-4 z-50">
        <div className="flex w-full items-center justify-between">
          {/* Left: Back + Title */}
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="group flex items-center justify-center w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </Link>
            <div className="flex flex-col justify-center">
              <h1 className="text-[20px] sm:text-[24px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight leading-none mb-0.5 [text-shadow:-1.5px_0_0_rgba(0,200,255,0.3),1.5px_0_0_rgba(255,80,0,0.3)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.6),1.5px_0_0_rgba(255,80,0,0.6)]">
                {project.title}
              </h1>
              <p className="text-[12px] text-zinc-500 dark:text-zinc-400 font-medium">
                Projects/{project.title}
              </p>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-start justify-end gap-2 sm:gap-3 h-20 sm:h-24 py-1">
            <CommandMenu />
            <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div id="main-content" tabIndex={-1} className="ml-0 mr-0 md:ml-[30%] md:mr-[30%] pt-[calc(22vh+112px)] pb-16 px-4 flex flex-col z-10 relative">

        {/* Media (Video or Image) right at the top */}
        <div className="w-full aspect-video relative mt-8 rounded-lg overflow-hidden border border-black/10 dark:border-white/[0.15] shadow-sm bg-black z-20">
          {project.video ? (
            project.video.includes('youtube') ? (
              <iframe
                src={project.video}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video 
                src={project.video} 
                className="w-full h-full object-cover" 
                controls 
                autoPlay 
                muted 
                loop 
                playsInline 
              />
            )
          ) : (
<>
{project.lightModeSrc && (
            <Image 
              src={project.lightModeSrc} 
              alt={`${project.title}: ${project.imageTitle}`} 
              fill 
              preload
              sizes="(min-width: 768px) 40vw, 100vw"
              quality={75}
              className="object-cover object-top dark:hidden"
            />
)}
            <Image 
              src={project.src} 
              alt={`${project.title}: ${project.imageTitle}`} 
              fill 
              preload
              sizes="(min-width: 768px) 40vw, 100vw"
              quality={75}
              className={`object-cover object-top ${project.lightModeSrc ? "hidden dark:block" : ""}`}
            />
</>
          )}
        </div>

        {/* Top Dashed Divider (Blueprint system) */}
        <div className="relative mt-8">
          <div className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
          <div className="absolute left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
          <div className="absolute right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
        </div>

        {/* Action Links Grid */}
        <div className="grid grid-cols-2 items-center py-4 relative">
          {project.live ? (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-md py-1 text-[13px] font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40 dark:focus-visible:ring-white/40">
              <ExternalLink className="w-4 h-4" aria-hidden="true" /> Live Demo
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : (
            <span className="flex items-center justify-center gap-2 text-[13px] text-zinc-400 dark:text-zinc-600">
              <ExternalLink className="w-4 h-4" aria-hidden="true" /> No live demo yet
            </span>
          )}

          {/* Vertical Divider */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0 border-l border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)' }} />

          {project.github ? (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-md py-1 text-[13px] font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40 dark:focus-visible:ring-white/40">
              <SiGithub className="w-4 h-4" aria-hidden="true" /> GitHub
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : <div />}
        </div>

        {/* Bottom Dashed Divider */}
        <div className="relative mb-6">
          <div className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
          <div className="absolute left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
          <div className="absolute right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
        </div>

        {/* Title and Status */}
        <div className="flex items-center justify-between w-full mb-4">
          <h1 className="text-[24px] sm:text-[28px] font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
            {project.title}
          </h1>
          {project.live && (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[13px] font-medium text-emerald-600 dark:text-emerald-400">Live</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-[14px] sm:text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
          {project.description}
        </p>
        {project.credit && (
          <p className="mt-2 text-[13px] italic text-zinc-500">{project.credit}</p>
        )}

        {/* Dashed Divider before Stack */}
        <div className="relative mt-8 mb-6">
          <div className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
          <div className="absolute left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
          <div className="absolute right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
        </div>

        {/* Tech Stack */}
        <div>
          <h2 className="text-[16px] font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">Stack used</h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t: TechItem, i: number) => {
              const isKey = typeof t === "string";
              const label = isKey ? techNames[t as TechKey] : t.label;
              const Icon = isKey ? iconMap[t as TechKey] : null;

              return (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/5 rounded-md text-[12px] font-medium text-zinc-700 dark:text-zinc-300">
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
