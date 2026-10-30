"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Icon } from "@/components/icons";
import { MorphPill } from "@/components/morph-pill";
import { StatusBadge } from "@/components/status-badge";
import { heroSlots, site } from "@/data/site";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const CYCLE_MS = 2400;
// Hovering a pill again within this window does not re-trigger it.
const HOVER_COOLDOWN_MS = 700;

const sentence = (w: string[]) =>
  `I build ${w[0]} for ${w[1]}, sweat the ${w[2]}, and ship from ${w[3]}.`;

export function Hero() {
  const reduced = useReducedMotion();
  const [indexes, setIndexes] = useState(() => heroSlots.map(() => 0));
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const lastSwap = useRef(heroSlots.map(() => 0));

  const advance = useCallback((slot: number) => {
    lastSwap.current[slot] = performance.now();
    setIndexes((prev) => prev.map((v, i) => (i === slot ? (v + 1) % heroSlots[i].length : v)));
  }, []);

  const hover = (slot: number) => {
    if (performance.now() - lastSwap.current[slot] > HOVER_COOLDOWN_MS) advance(slot);
  };

  // Round-robin auto cycle, only while visible, unpaused and motion is allowed.
  useEffect(() => {
    if (paused || reduced) return;
    const el = sectionRef.current;
    if (!el) return;
    let timer = 0;
    let tick = 0;
    let onScreen = false;
    const run = () => {
      window.clearInterval(timer);
      if (!onScreen || document.hidden) return;
      timer = window.setInterval(() => advance(tick++ % heroSlots.length), CYCLE_MS);
    };
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      run();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", run);
    return () => {
      window.clearInterval(timer);
      io.disconnect();
      document.removeEventListener("visibilitychange", run);
    };
  }, [paused, reduced, advance]);

  const words = heroSlots.map((slot, i) => slot[indexes[i]].word);
  const autoCycling = !paused && !reduced;

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-title"
      className="shell relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center pt-12 pb-24"
    >
      <div className="self-start">
        <StatusBadge>
          {site.status}
          <span className="hidden sm:inline"> · {site.statusDetail}</span>
        </StatusBadge>
      </div>

      <h1
        id="hero-title"
        className="mt-10 max-w-[23ch] text-[length:var(--step-hero)] leading-[1.12] font-medium tracking-[-0.035em] text-balance [font-stretch:92%] sm:mt-14"
      >
        <span className="sr-only">{sentence(heroSlots.map((s) => s[0].word))}</span>
        <span aria-hidden="true">
          I build{" "}
          <MorphPill
            words={heroSlots[0]}
            index={indexes[0]}
            reduced={reduced}
            onPointerEnter={() => hover(0)}
          />{" "}
          for{" "}
          <span className="whitespace-nowrap">
            <MorphPill
              words={heroSlots[1]}
              index={indexes[1]}
              reduced={reduced}
              onPointerEnter={() => hover(1)}
            />
            ,
          </span>{" "}
          sweat the{" "}
          <span className="whitespace-nowrap">
            <MorphPill
              words={heroSlots[2]}
              index={indexes[2]}
              reduced={reduced}
              onPointerEnter={() => hover(2)}
            />
            ,
          </span>{" "}
          and ship from{" "}
          <span className="whitespace-nowrap">
            <MorphPill
              words={heroSlots[3]}
              index={indexes[3]}
              reduced={reduced}
              onPointerEnter={() => hover(3)}
            />
            .
          </span>
        </span>
      </h1>

      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 sm:mt-16">
        <p className="max-w-[44ch] text-mute">
          {site.name}. CS student at MIT-WPU, founder and developer of{" "}
          <a className="link" href="https://ovrt.in" rel="noopener" target="_blank">
            OVRT
          </a>
          .
        </p>
        <div className="flex items-center gap-1" role="group" aria-label="Hero words">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            disabled={reduced}
            className="mono-label inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 transition-colors hover:text-paper disabled:hidden"
          >
            <Icon name={autoCycling ? "pause" : "play"} />
            {autoCycling ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => heroSlots.forEach((_, i) => advance(i))}
            className="mono-label inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 transition-colors hover:text-paper"
          >
            <Icon name="shuffle" />
            Shuffle
          </button>
          <p className="sr-only" aria-live="polite">
            {paused || reduced ? sentence(words) : ""}
          </p>
        </div>
      </div>

      <a
        href="#work"
        className="mono-label absolute bottom-8 left-[var(--gutter)] inline-flex items-center gap-2 transition-colors hover:text-paper"
      >
        <span className="inline-block h-px w-8 bg-line-strong" aria-hidden="true" />
        Selected work
      </a>
    </section>
  );
}
