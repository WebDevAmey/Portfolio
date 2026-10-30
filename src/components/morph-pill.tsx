"use client";

import { useLayoutEffect, useRef } from "react";

import type { HeroWord } from "@/data/site";
import { duration, easing } from "@/lib/motion";
import { Icon } from "./icons";

type MorphPillProps = {
  words: HeroWord[];
  index: number;
  reduced: boolean;
  onPointerEnter: () => void;
};

const squashOut: Keyframe[] = [
  { transform: "scale(1, 1)", filter: "blur(0px)", opacity: 1 },
  { transform: "scale(1.12, 0.55)", filter: "blur(6px)", opacity: 0 },
];
const springIn: Keyframe[] = [
  { transform: "scale(0.6)", filter: "blur(6px)", opacity: 0 },
  { transform: "scale(1)", filter: "blur(0px)", opacity: 1 },
];
const iconIn: Keyframe[] = [
  { transform: "rotate(-90deg) scale(0.4)", opacity: 0 },
  { transform: "rotate(0deg) scale(1)", opacity: 1 },
];
const fadeOut: Keyframe[] = [{ opacity: 1 }, { opacity: 0 }];
const fadeIn: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }];

/**
 * Every word is stacked in one grid cell so the pill always reserves the width of its longest word.
 * Visibility is driven by `data-active` (React) and `data-leaving` (set here while a word animates out).
 */
export function MorphPill({ words, index, reduced, onPointerEnter }: MorphPillProps) {
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const previous = useRef(index);

  useLayoutEffect(() => {
    const from = previous.current;
    previous.current = index;
    if (from === index) return;

    const swap = (els: (HTMLSpanElement | null)[], enter: Keyframe[]) => {
      const leaving = els[from];
      const entering = els[index];
      if (leaving) {
        leaving.dataset.leaving = "true";
        const out = leaving.animate(reduced ? fadeOut : squashOut, {
          duration: duration.fast,
          easing: easing.in,
          fill: "forwards",
        });
        out.onfinish = () => {
          delete leaving.dataset.leaving;
          out.cancel();
        };
      }
      entering?.animate(reduced ? fadeIn : enter, {
        duration: reduced ? duration.fast : duration.slow,
        delay: reduced ? 0 : duration.fast * 0.6,
        easing: reduced ? "linear" : easing.spring,
        fill: "backwards",
      });
    };

    swap(wordRefs.current, springIn);
    swap(iconRefs.current, iconIn);
  }, [index, reduced]);

  return (
    <span
      className="group/pill mx-[0.04em] inline-flex translate-y-[-0.05em] items-center gap-[0.18em] rounded-[0.3em] border border-line bg-ink-2 py-[0.02em] pr-[0.22em] pl-[0.09em] align-middle leading-[1.05] transition-colors duration-[var(--dur-base)] hover:border-line-strong"
      onPointerEnter={onPointerEnter}
    >
      <span className="grid size-[0.86em] shrink-0 place-items-center overflow-hidden rounded-[0.2em] bg-cobalt text-[0.56em] text-paper">
        {words.map((w, i) => (
          <span
            key={w.word}
            ref={(el) => {
              iconRefs.current[i] = el;
            }}
            data-active={i === index}
            className="col-start-1 row-start-1 flex data-[active=false]:not-data-leaving:invisible"
          >
            <Icon name={w.icon} strokeWidth={2.25} />
          </span>
        ))}
      </span>
      <span className="grid">
        {words.map((w, i) => (
          <span
            key={w.word}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            data-active={i === index}
            className="col-start-1 row-start-1 origin-center whitespace-nowrap data-[active=false]:not-data-leaving:invisible"
          >
            {w.word}
          </span>
        ))}
      </span>
    </span>
  );
}
