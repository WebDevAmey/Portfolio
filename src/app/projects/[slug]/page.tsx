import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Icon } from "@/components/icons";
import { ProjectThumb } from "@/components/project-thumb";
import { getNextProject, getProject, projects } from "@/data/projects";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.name,
      description: project.summary,
      url: `/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const next = getNextProject(project.slug);

  const links = [
    project.links.live && { label: "Visit live", href: project.links.live },
    project.links.repo && { label: "Source on GitHub", href: project.links.repo },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <article className="shell py-12 sm:py-20">
      <Link
        href="/#work"
        className="mono-label inline-flex min-h-11 items-center gap-2 transition-colors hover:text-paper"
      >
        <Icon name="arrowRight" className="rotate-180" />
        All work
      </Link>

      <header className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <p className="mono-label mb-4">{project.kind}</p>
          <h1 className="font-display text-[length:var(--step-hero)] leading-[1.02] font-medium tracking-[-0.04em]">
            {project.name}
          </h1>
        </div>
        <p className="max-w-[40ch] text-[length:var(--step-2)] leading-[1.35] text-paper/90">
          {project.summary}
        </p>
      </header>

      <ProjectThumb
        project={project}
        sizes="(min-width: 1312px) 1232px, 100vw"
        priority
        className="mt-12 aspect-[16/10] w-full rounded-[var(--radius-card)] border border-line"
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <p className="max-w-[60ch] text-[length:var(--step-1)] leading-[1.7] text-paper/90">
          {project.description}
        </p>
        <dl className="grid content-start gap-0 border-t border-line">
          {project.role && (
            <div className="border-b border-line py-4">
              <dt className="mono-label">Role</dt>
              <dd className="mt-1">{project.role}</dd>
            </div>
          )}
          <div className="border-b border-line py-4">
            <dt className="mono-label">Stack</dt>
            <dd className="mt-1">{project.stack.join(", ")}</dd>
          </div>
          {project.credit && (
            <div className="border-b border-line py-4">
              <dt className="mono-label">Credit</dt>
              <dd className="mt-1">{project.credit}</dd>
            </div>
          )}
          {links.length > 0 && (
            <div className="border-b border-line py-4">
              <dt className="mono-label">Links</dt>
              <dd className="mt-1 flex flex-col gap-1">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener"
                    className="link inline-flex w-fit items-center gap-1.5"
                  >
                    {l.label}
                    <Icon name="arrow" />
                  </a>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <Link
        href={`/projects/${next.slug}`}
        className="group mt-24 flex items-end justify-between gap-6 border-t border-line pt-8"
      >
        <span>
          <span className="mono-label block">Next project</span>
          <span className="mt-2 block font-display text-[length:var(--step-3)] leading-tight font-medium tracking-[-0.03em] transition-colors group-hover:text-cobalt-bright">
            {next.name}
          </span>
        </span>
        <Icon
          name="arrowRight"
          className="mb-3 text-[1.75rem] transition-transform duration-[var(--dur-base)] group-hover:translate-x-1"
        />
      </Link>
    </article>
  );
}
