"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";

import type { Project } from "@/data/projects";
import { Icon } from "./icons";
import { ProjectThumb } from "./project-thumb";

// Fan geometry for a card `depth` places from the front, on the left (-1) or right (+1).
const STEP_PCT = 34; // horizontal spread per depth, as a share of the card width
const DROP_PX = 10; // how far each step sinks, so the hand reads as an arc
const TILT_DEG = 6;
const SHRINK = 0.06;

/** Front card in the middle, the rest alternating left and right behind it. */
const placement = (slot: number) => {
  if (slot === 0) return { side: 0, depth: 0 };
  const depth = Math.ceil(slot / 2);
  return { side: slot % 2 === 1 ? -1 : 1, depth };
};

export function WorksFan({ projects }: { projects: Project[] }) {
  // order[0] is the project at the front.
  const [order, setOrder] = useState(() => projects.map((_, i) => i));
  const frontLink = useRef<HTMLAnchorElement>(null);
  const count = projects.length;
  const front = projects[order[0]];

  const bringForward = (index: number, focus = false) => {
    // Rotate the deck so the chosen card leads and the others keep their sequence.
    setOrder(Array.from({ length: count }, (_, k) => (index + k) % count));
    if (focus) requestAnimationFrame(() => frontLink.current?.focus());
  };
  const step = (delta: number) => bringForward((order[0] + delta + count) % count);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") step(1);
    else if (event.key === "ArrowLeft") step(-1);
    else return;
    event.preventDefault();
  };

  return (
    <div className="column-wide" onKeyDown={onKeyDown}>
      <div
        role="group"
        aria-roledescription="card deck"
        aria-label="Selected projects. Use the left and right arrow keys to shuffle."
        className="relative mx-auto h-[clamp(13rem,42vw,23rem)] w-full max-w-[44rem]"
      >
        {projects.map((project, index) => {
          const slot = order.indexOf(index);
          const { side, depth } = placement(slot);
          const isFront = slot === 0;
          const transform = `translate(-50%, 0) translateX(${side * depth * STEP_PCT}%) translateY(${depth * depth * DROP_PX}px) rotate(${side * depth * TILT_DEG}deg) scale(${1 - depth * SHRINK})`;
          const card = (
            <ProjectThumb
              project={project}
              sizes="(min-width: 768px) 380px, 60vw"
              showName={!project.image}
              className="aspect-[16/10] w-full rounded-[0.9rem] bg-chip"
            />
          );
          const frame =
            "block rounded-[1.25rem] bg-surface p-1.5 outline-offset-4 transition-shadow duration-[var(--dur-base)]";
          return (
            <div
              key={project.slug}
              className="absolute top-2 left-1/2 w-[min(62%,24rem)] origin-bottom transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{ transform, zIndex: 50 - depth * 2 - (side > 0 ? 1 : 0) }}
            >
              {isFront ? (
                <Link
                  ref={frontLink}
                  href={`/projects/${project.slug}`}
                  aria-label={`${project.name}, open case study`}
                  className={`${frame} shadow-[0_2px_4px_rgba(0,0,0,0.04),0_24px_48px_-16px_rgba(0,0,0,0.28)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_30px_60px_-18px_rgba(0,0,0,0.34)]`}
                >
                  {card}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => bringForward(index, true)}
                  aria-label={`Show ${project.name}`}
                  className={`${frame} w-full cursor-pointer text-left shadow-[0_1px_3px_rgba(0,0,0,0.05),0_14px_30px_-14px_rgba(0,0,0,0.22)] hover:-translate-y-1 hover:transition-transform`}
                >
                  {card}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-6 flex max-w-[34rem] items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous project"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-chip transition-colors hover:bg-[#e2e2df]"
        >
          <Icon name="arrowRight" className="rotate-180" />
        </button>
        <div aria-live="polite" className="min-h-[4.5rem] text-center">
          <div key={front.slug} className="caption-fade">
            <p className="text-[length:var(--step-1)] font-semibold tracking-[-0.01em]">
              {front.name} <span className="mono-label ml-1 align-middle">{front.kind}</span>
            </p>
            <p className="mt-1 text-[length:var(--step-small)] text-mute">{front.summary}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next project"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-chip transition-colors hover:bg-[#e2e2df]"
        >
          <Icon name="arrowRight" />
        </button>
      </div>
      <p className="mono-label mt-3 text-center tabular-nums" aria-hidden="true">
        {String(order[0] + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </p>
    </div>
  );
}
