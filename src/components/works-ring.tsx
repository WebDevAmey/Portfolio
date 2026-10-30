"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import type { Project } from "@/data/projects";
import { ProjectThumb } from "./project-thumb";

const TAU = Math.PI * 2;
// Radians per second the ring drifts on its own; slows while a card is in the spotlight.
const IDLE_SPEED = 0.05;
const ACTIVE_SPEED_FACTOR = 0.2;
const ENTRANCE_MS = 1300;
const ENTRANCE_STAGGER_MS = 50;
const SCROLL_PUSH = 0.004;
const DRAG_PUSH = 0.02;
const MAX_VELOCITY = 5;
// Fraction of velocity kept after one second.
const FRICTION = 0.04;
const EDGE_PX = 28;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number) => {
  const c1 = 1.4;
  return 1 + (c1 + 1) * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));

// Letters roll up into place, one after another, whenever the label changes.
function RollingLabel({ text }: { text: string }) {
  return (
    <span
      key={text}
      className="flex justify-center overflow-hidden leading-[1.15]"
      aria-hidden="true"
    >
      {Array.from(text).map((char, i) => (
        <span
          key={i}
          className="roll-letter inline-block"
          style={{ animationDelay: `${i * 18}ms` }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}

export function WorksRing({ projects }: { projects: Project[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const activeRef = useRef<number | null>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || projects.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = projects.length;

    let cardW = 0;
    let rx = 0;
    let ry = 0;

    const measure = () => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      cardW = Math.min(230, Math.max(150, width * 0.13));
      const cardH = cardW * 0.625;
      rx = Math.max(0, Math.min(width / 2 - cardW / 2 - EDGE_PX, 560));
      // Keep clear of the hint and caption along the bottom edge.
      ry = Math.max(0, Math.min(height / 2 - cardH / 2 - EDGE_PX * 3, rx * 0.6));
      cardRefs.current.forEach((el) => {
        if (!el) return;
        el.style.width = `${cardW}px`;
        el.style.height = `${cardH}px`;
        el.style.marginLeft = `${-cardW / 2}px`;
        el.style.marginTop = `${-cardH / 2}px`;
      });
    };

    let rotation = -Math.PI / 2;
    let velocity = 0;
    let entranceStart: number | null = reduceMotion ? -Infinity : null;
    let visible = false;
    let frame = 0;
    let last = performance.now();
    let lastScrollY = window.scrollY;

    // Dragging spins the ring; a drag that moves suppresses the click on release.
    let dragging = false;
    let dragMoved = false;
    let dragX = 0;

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (!reduceMotion) {
        const idle = activeRef.current !== null ? IDLE_SPEED * ACTIVE_SPEED_FACTOR : IDLE_SPEED;
        rotation += (idle + velocity) * dt;
        velocity *= Math.pow(FRICTION, dt);
      }

      for (let i = 0; i < count; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const slot = (i / count) * TAU + rotation;
        let angle = slot;
        let scale = 1;
        if (entranceStart === null) {
          scale = 0;
        } else if (Number.isFinite(entranceStart)) {
          const t = Math.min(
            1,
            Math.max(0, (now - entranceStart - i * ENTRANCE_STAGGER_MS) / ENTRANCE_MS),
          );
          // Cards start stacked at the top and fan out to their slot.
          angle = rotation + (slot - rotation) * easeOutCubic(t);
          scale = t === 0 ? 0 : easeOutBack(t);
        }
        const x = Math.cos(angle) * rx;
        const y = Math.sin(angle) * ry;
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
        el.style.zIndex = activeRef.current === i ? "200" : String(100 + Math.round(y / 10));
      }

      if (
        entranceStart !== null &&
        Number.isFinite(entranceStart) &&
        now - entranceStart > ENTRANCE_MS + count * ENTRANCE_STAGGER_MS
      ) {
        entranceStart = -Infinity;
      }

      if (visible && !reduceMotion) frame = requestAnimationFrame(render);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      last = performance.now();
      frame = requestAnimationFrame(render);
    };

    measure();
    render(performance.now());

    const resizeObserver = new ResizeObserver(() => {
      measure();
      render(performance.now());
    });
    resizeObserver.observe(stage);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && entranceStart === null) entranceStart = performance.now();
        if (visible) start();
        else cancelAnimationFrame(frame);
        if (reduceMotion) render(performance.now());
      },
      { threshold: 0.25 },
    );
    intersectionObserver.observe(stage);

    // Scrolling the page gives the ring a push in the same direction.
    const onScroll = () => {
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      if (!reduceMotion && visible) velocity = clamp(velocity + delta * SCROLL_PUSH, MAX_VELOCITY);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragging = true;
      dragMoved = false;
      dragX = event.clientX;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - dragX;
      dragX = event.clientX;
      if (Math.abs(dx) > 2) dragMoved = true;
      if (reduceMotion) {
        rotation -= dx * 0.005;
        render(performance.now());
      } else {
        velocity = clamp(velocity - dx * DRAG_PUSH, MAX_VELOCITY);
      }
    };
    const onPointerUp = () => {
      dragging = false;
    };
    const onClickCapture = (event: MouseEvent) => {
      if (!dragMoved) return;
      event.preventDefault();
      event.stopPropagation();
      dragMoved = false;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    stage.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("click", onClickCapture, true);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      stage.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("click", onClickCapture, true);
    };
  }, [projects]);

  // Roving focus: the ring is a single tab stop and arrow keys move between projects.
  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const keys: Record<string, (i: number) => number> = {
      ArrowRight: (i) => (i + 1) % projects.length,
      ArrowDown: (i) => (i + 1) % projects.length,
      ArrowLeft: (i) => (i - 1 + projects.length) % projects.length,
      ArrowUp: (i) => (i - 1 + projects.length) % projects.length,
      Home: () => 0,
      End: () => projects.length - 1,
    };
    const move = keys[event.key];
    if (!move) return;
    event.preventDefault();
    const next = move(focusIndex);
    setFocusIndex(next);
    linkRefs.current[next]?.focus();
  };

  const activeProject = active !== null ? projects[active] : null;
  const label = activeProject ? activeProject.name.toUpperCase() : "WORKS";

  return (
    <div
      ref={stageRef}
      className="relative h-[min(100svh,62rem)] min-h-[44rem] touch-pan-y overflow-hidden select-none"
      onMouseLeave={() => setActive(null)}
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 z-[300] -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-[clamp(1.5rem,1rem+1.2vw,2.25rem)] font-semibold tracking-[-0.03em] whitespace-nowrap">
          <RollingLabel text={label} />
        </p>
        <p className="mono-label mt-2 tabular-nums" aria-hidden="true">
          {activeProject
            ? activeProject.kind
            : `${String(projects.length).padStart(2, "0")} projects`}
        </p>
      </div>

      <ul
        className="contents"
        aria-label="Projects. Use arrow keys to move between them."
        onKeyDown={onKeyDown}
      >
        {projects.map((project, i) => {
          const isActive = active === i;
          const isDimmed = active !== null && !isActive;
          return (
            <li
              key={project.slug}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute top-1/2 left-1/2 will-change-transform"
              style={{ transform: "scale(0)" }}
            >
              <Link
                ref={(el) => {
                  linkRefs.current[i] = el;
                }}
                href={`/projects/${project.slug}`}
                tabIndex={i === focusIndex ? 0 : -1}
                draggable={false}
                aria-label={project.name}
                aria-describedby={isActive ? "works-caption" : undefined}
                onMouseEnter={() => setActive(i)}
                onFocus={() => {
                  setActive(i);
                  setFocusIndex(i);
                }}
                onBlur={() => setActive(null)}
                className={`block size-full overflow-hidden rounded-[var(--radius-sm)] bg-surface ring-1 transition-[filter,transform,box-shadow,opacity] duration-[var(--dur-slow)] ease-out motion-reduce:transition-[filter,opacity] ${
                  isActive
                    ? "scale-110 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] ring-fg"
                    : "scale-100 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.3)] ring-line grayscale"
                } ${isDimmed ? "opacity-35" : ""}`}
              >
                <ProjectThumb
                  project={project}
                  sizes="230px"
                  className="pointer-events-none size-full"
                />
              </Link>
            </li>
          );
        })}
      </ul>

      <div
        id="works-caption"
        aria-live="polite"
        className={`absolute right-[var(--gutter)] bottom-8 z-[300] max-w-[22rem] text-right transition-opacity duration-[var(--dur-base)] ${
          activeProject ? "opacity-100" : "opacity-0"
        }`}
      >
        {activeProject && (
          <>
            <p className="text-[length:var(--step-0)] leading-snug text-fg">
              {activeProject.summary}
            </p>
            <p className="mono-label mt-2">{activeProject.stack.slice(0, 3).join(" · ")}</p>
          </>
        )}
      </div>

      <p
        className="mono-label absolute bottom-8 left-[var(--gutter)] z-[300] leading-relaxed"
        aria-hidden="true"
      >
        Hover or drag to explore
        <br />← → to cycle · Enter to open
      </p>
    </div>
  );
}
