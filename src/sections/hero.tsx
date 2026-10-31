import type { ReactNode } from "react";

import { Icon, Mark, type IconName } from "@/components/icons";
import { StatusBadge } from "@/components/status-badge";
import { site } from "@/data/site";

type Tone = "yellow" | "violet" | "green" | "blue" | "pink" | "peach";

const tones: Record<Tone, string> = {
  yellow: "bg-hl-yellow",
  violet: "bg-hl-violet",
  green: "bg-hl-green",
  blue: "bg-hl-blue",
  pink: "bg-hl-pink",
  peach: "bg-hl-peach",
};

/** A pastel marker behind a keyword. Links get a slightly deeper wash on hover. */
function Highlight({ tone, href, children }: { tone: Tone; href?: string; children: ReactNode }) {
  const className = `rounded-[0.3em] px-[0.22em] py-[0.04em] text-fg [box-decoration-break:clone] ${tones[tone]}`;
  if (!href) return <span className={className}>{children}</span>;
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener me" } : {})}
      className={`${className} transition-[filter] duration-[var(--dur-base)] hover:brightness-95`}
    >
      {children}
    </a>
  );
}

/** An inline chip with a small black icon tile, for places and products. */
function Badge({
  icon,
  href,
  children,
}: {
  icon: IconName | "mark";
  href?: string;
  children: ReactNode;
}) {
  const body = (
    <>
      <span className="grid size-[1.05em] place-items-center rounded-[0.25em] bg-fg text-[0.62em] text-bg">
        {icon === "mark" ? <Mark /> : <Icon name={icon} strokeWidth={2.25} />}
      </span>
      {children}
    </>
  );
  const className =
    "mx-[0.05em] inline-flex translate-y-[-0.06em] items-center gap-[0.3em] rounded-[0.4em] border border-line-strong bg-surface py-[0.02em] pr-[0.35em] pl-[0.2em] align-middle leading-[1.25] text-fg shadow-[0_1px_0_var(--line)]";
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={`${className} transition-colors hover:border-fg`}
    >
      {body}
    </a>
  ) : (
    <span className={className}>{body}</span>
  );
}

// Each chunk fades in a beat after the last, like the sentence being written.
const Chunk = ({ i, children }: { i: number; children: ReactNode }) => (
  <span className="reveal" style={{ animationDelay: `${120 + i * 70}ms` }}>
    {children}
  </span>
);

const [github, x, linkedin] = site.socials;

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="column flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center py-16 text-center"
    >
      <div className="reveal">
        <StatusBadge>
          {site.status}
          <span className="hidden sm:inline"> · {site.statusDetail}</span>
        </StatusBadge>
      </div>

      <h1 id="hero-title" className="sr-only">
        {site.name}, {site.role.toLowerCase()}
      </h1>

      <p className="mt-10 text-[length:var(--step-intro)] leading-[1.75] font-medium tracking-[-0.018em] text-pretty">
        <Chunk i={0}>Hi, I&apos;m {site.shortName}. </Chunk>
        <Chunk i={1}>
          I study Computer Science at <Badge icon="glyph">MIT-WPU</Badge> in{" "}
          <Badge icon="pin">Pune</Badge>,{" "}
        </Chunk>
        <Chunk i={2}>
          and I&apos;m the founder and developer of{" "}
          <Badge icon="mark" href="https://ovrt.in">
            OVRT
          </Badge>
        </Chunk>
        <Chunk i={3}>
          <span className="text-mute">
            , a decision-intelligence platform that shows Indian D2C founders where their growth is
            leaking.
          </span>{" "}
        </Chunk>
        <Chunk i={4}>
          On the side I build{" "}
          <Highlight tone="yellow" href="#work">
            open-source tools
          </Highlight>{" "}
          and{" "}
          <Highlight tone="violet" href="/projects/minikv">
            low-level experiments
          </Highlight>
          <span className="text-mute">
            , like a Raft key-value store written from scratch.
          </span>{" "}
        </Chunk>
        <Chunk i={5}>
          I share code on{" "}
          <Highlight tone="green" href={github.href}>
            GitHub
          </Highlight>
          , think out loud on{" "}
          <Highlight tone="blue" href={x.href}>
            X
          </Highlight>{" "}
          and keep it formal on{" "}
          <Highlight tone="pink" href={linkedin.href}>
            LinkedIn
          </Highlight>
          .
        </Chunk>
      </p>

      <p
        className="reveal mt-8 text-[length:var(--step-intro)] font-medium tracking-[-0.018em]"
        style={{ animationDelay: "600ms" }}
      >
        <span className="text-mute">Got something in mind? </span>
        <Highlight tone="peach" href="#contact">
          Let&apos;s talk
        </Highlight>
      </p>

      <a
        href="#work"
        className="reveal mono-label mt-14 inline-flex min-h-11 items-center gap-2 transition-colors hover:text-fg"
        style={{ animationDelay: "700ms" }}
      >
        Selected work
        <Icon name="arrow" className="rotate-[135deg]" />
      </a>
    </section>
  );
}
