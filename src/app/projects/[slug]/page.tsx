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
    <article className="column-wide pt-10 pb-[var(--section-y)] sm:pt-16">
      <Link
        href="/#work"
        className="mono-label inline-flex min-h-11 items-center gap-2 transition-colors hover:text-fg"
      >
        <Icon name="arrowRight" className="rotate-180" />
        All work
      </Link>

      <header className="mx-auto mt-8 max-w-[var(--measure)]">
        <div>
          <p className="mono-label mb-3">{project.kind}</p>
          <h1 className="text-[length:var(--step-display)] leading-[1.1] font-semibold tracking-[-0.03em]">
            {project.name}
          </h1>
        </div>
        <p className="mt-4 text-[length:var(--step-1)] text-mute">{project.summary}</p>
      </header>

      <ProjectThumb
        project={project}
        sizes="(min-width: 1040px) 960px, 100vw"
        priority
        className="mt-10 aspect-[16/10] w-full rounded-[var(--radius-card)] border border-line bg-surface"
      />

      <div className="mx-auto mt-12 max-w-[var(--measure)]">
        <p className="leading-[1.75] text-fg-2">{project.description}</p>
        <dl className="mt-10 grid border-t border-line sm:grid-cols-2 sm:gap-x-8">
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
        className="group mx-auto mt-20 flex max-w-[var(--measure)] items-end justify-between gap-6 border-t border-line pt-8"
      >
        <span>
          <span className="mono-label block">Next project</span>
          <span className="mt-2 block text-[length:var(--step-2)] leading-tight font-semibold tracking-[-0.02em] underline-offset-4 group-hover:underline">
            {next.name}
          </span>
        </span>
        <Icon
          name="arrowRight"
          className="mb-1 text-[1.5rem] transition-transform duration-[var(--dur-base)] group-hover:translate-x-1"
        />
      </Link>
    </article>
  );
}
