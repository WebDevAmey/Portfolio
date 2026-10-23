"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/data/projectsData";

const TAU = Math.PI * 2;
// Radians per second the ring drifts on its own.
const IDLE_SPEED = 0.05;
const ENTRANCE_MS = 1300;
const ENTRANCE_STAGGER_MS = 60;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// Letters roll up into place, one after another, whenever the label changes.
function RollingLabel({ text }: { text: string }) {
  return (
    <span key={text} className="flex overflow-hidden leading-[1.15]" aria-hidden="true">
      {Array.from(text).map((char, i) => (
        <span
          key={i}
          className="works-letter inline-block"
          style={{ animationDelay: `${i * 18}ms` }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}

type WorksRingProps = {
  projects: Project[];
  // Projects repeat until the ring holds at least this many cards.
  minCards?: number;
  label?: string;
  className?: string;
};

export function WorksRing({ projects, minCards = 12, label = "Works", className = "" }: WorksRingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);

  const cards = useMemo(() => {
    if (projects.length === 0) return [];
    const count = Math.max(minCards, projects.length);
    return Array.from({ length: count }, (_, i) => ({
      project: projects[i % projects.length],
      // Only the first copy of each project is reachable by keyboard and screen readers.
      isCopy: i >= projects.length,
    }));
  }, [projects, minCards]);

  useEffect(() => {
    activeRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || cards.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = cards.length;

    let width = 0;
    let height = 0;
    let cardW = 0;
    let cardH = 0;
    let rx = 0;
    let ry = 0;

    const measure = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      // Narrow columns get relatively larger cards and a rounder ring.
      const narrow = width < 700;
      cardW = narrow ? Math.min(150, width * 0.3) : Math.min(190, Math.max(130, width * 0.13));
      cardH = cardW * (2 / 3);
      rx = Math.max(0, Math.min(width / 2 - cardW / 2 - 8, 380));
      ry = Math.max(0, Math.min(height / 2 - cardH / 2 - 8, rx * (narrow ? 0.9 : 0.66)));
      cardRefs.current.forEach((el) => {
        if (!el) return;
        el.style.width = `${cardW}px`;
        el.style.height = `${cardH}px`;
        el.style.marginLeft = `${-cardW / 2}px`;
        el.style.marginTop = `${-cardH / 2}px`;
      });
    };

    let rotation = 0;
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
        const hovering = activeRef.current !== null;
        const idle = hovering ? IDLE_SPEED * 0.2 : IDLE_SPEED;
        rotation += (idle + velocity) * dt;
        velocity *= Math.pow(0.04, dt);
      }

      cards.forEach((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        const slot = (i / count) * TAU + rotation;

        let angle = slot;
        let scale = 1;
        if (entranceStart !== null && Number.isFinite(entranceStart)) {
          const t = Math.min(1, Math.max(0, (now - entranceStart - i * ENTRANCE_STAGGER_MS) / ENTRANCE_MS));
          // Every card starts stacked on the right edge and fans out to its slot.
          angle = rotation + (slot - rotation) * easeOutCubic(t);
          scale = t === 0 ? 0 : easeOutBack(t);
        } else if (entranceStart === null) {
          scale = 0;
        }

        const x = Math.cos(angle) * rx;
        const y = Math.sin(angle) * ry;
        el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${scale.toFixed(4)})`;
        el.style.zIndex = activeRef.current === i ? "2000" : String(1000 + Math.round(y));
      });

      if (entranceStart !== null && Number.isFinite(entranceStart) && now - entranceStart > ENTRANCE_MS + count * ENTRANCE_STAGGER_MS) {
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
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && entranceStart === null) entranceStart = performance.now();
        if (visible) start();
        else cancelAnimationFrame(frame);
        if (reduceMotion) render(performance.now());
      },
      { threshold: 0.2 }
    );
    intersectionObserver.observe(container);

    // Scrolling the page gives the ring a push in the same direction.
    const onScroll = () => {
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      if (!reduceMotion && visible) velocity = Math.max(-4, Math.min(4, velocity + delta * 0.004));
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
      if (Math.abs(dx) > 0) dragMoved = true;
      if (!reduceMotion) velocity = Math.max(-6, Math.min(6, velocity - dx * 0.02));
      else {
        rotation -= dx * 0.005;
        render(performance.now());
      }
    };
    const onPointerUp = () => {
      dragging = false;
    };
    const onClickCapture = (event: MouseEvent) => {
      if (dragMoved) {
        event.preventDefault();
        event.stopPropagation();
        dragMoved = false;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    container.addEventListener("click", onClickCapture, true);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("click", onClickCapture, true);
    };
  }, [cards]);

  const activeProject = activeIndex !== null ? cards[activeIndex]?.project : null;
  const labelText = (activeProject?.title ?? label).toUpperCase();

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden touch-pan-y ${className}`}
      onMouseLeave={() => setActiveIndex(null)}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[3000] -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="whitespace-nowrap text-[22px] font-medium tracking-[-0.03em] text-zinc-900 dark:text-zinc-100 sm:text-[28px]">
          <RollingLabel text={labelText} />
        </p>
        <p className="sr-only" aria-live="polite">
          {activeProject ? activeProject.title : ""}
        </p>
      </div>

      <ul className="contents">
        {cards.map(({ project, isCopy }, i) => {
          const isActive = activeIndex === i;
          const isDimmed = activeIndex !== null && !isActive;
          return (
            <li
              key={`${project.slug}-${i}`}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              aria-hidden={isCopy || undefined}
              className="absolute left-1/2 top-1/2 will-change-transform"
              style={{ transform: "scale(0)" }}
            >
              <Link
                href={`/projects/${project.slug}`}
                tabIndex={isCopy ? -1 : undefined}
                draggable={false}
                onMouseEnter={() => setActiveIndex(i)}
                onFocus={() => setActiveIndex(i)}
                onBlur={() => setActiveIndex(null)}
                className={`block size-full overflow-hidden rounded-[3px] ring-1 ring-black/10 transition-[filter,transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 motion-reduce:transition-[filter,opacity] dark:ring-white/10 ${
                  isActive ? "scale-110" : "scale-100"
                } ${isDimmed ? "opacity-50 grayscale dark:opacity-100 dark:brightness-[0.35]" : ""}`}
              >
                <span className="sr-only">{project.title}</span>
                <Image
                  src={project.src}
                  alt=""
                  width={380}
                  height={253}
                  sizes="190px"
                  quality={70}
                  draggable={false}
                  className={`block size-full object-cover object-left-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    isActive ? "scale-100" : "scale-110"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
