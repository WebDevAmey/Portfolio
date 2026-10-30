"use client";

import type { MouseEvent, ReactNode } from "react";

import { burstShards } from "@/lib/shards";
import { duration, easing, prefersReducedMotion } from "@/lib/motion";
import { Mark } from "./icons";

// The button restores, then the action fires, while the shards are still settling.
const ACTION_DELAY_MS = 650;

type SquishButtonProps = { href: string; children: ReactNode };

/**
 * A plain link that squishes on press and bursts into shards on click before following `href`.
 * Without JS, with reduced motion, or with a modified click it behaves like a normal link.
 */
export function SquishButton({ href, children }: SquishButtonProps) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
      return;
    if (prefersReducedMotion()) return;
    event.preventDefault();

    const button = event.currentTarget;
    burstShards(button.getBoundingClientRect());
    button.animate(
      [
        { transform: "scale(1)", opacity: 1 },
        { transform: "scale(1.06)", opacity: 1, offset: 0.3 },
        { transform: "scale(0.7)", opacity: 0 },
      ],
      { duration: duration.fast * 1.2, easing: easing.in, fill: "forwards" },
    ).onfinish = () => {
      button.animate(
        [
          { transform: "scale(0.6)", opacity: 0 },
          { transform: "scale(1)", opacity: 1 },
        ],
        { duration: duration.slow, delay: duration.base, easing: easing.spring, fill: "both" },
      );
    };

    window.setTimeout(() => {
      window.location.href = href;
    }, ACTION_DELAY_MS);
  };

  return (
    <a
      href={href}
      onClick={onClick}
      className="group relative inline-flex min-h-16 touch-manipulation items-center gap-3 rounded-full bg-ink-3 [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:4px_4px] py-4 pr-8 pl-5 text-[length:var(--step-1)] font-medium tracking-[-0.01em] text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-2px_6px_rgba(0,0,0,0.6),0_1px_0_rgba(0,0,0,0.8),0_14px_30px_-10px_rgba(0,0,0,0.9),0_0_0_1px_var(--line-strong)] transition-[transform,box-shadow] duration-[var(--dur-fast)] ease-squish hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-2px_6px_rgba(0,0,0,0.6),0_1px_0_rgba(0,0,0,0.8),0_22px_40px_-12px_var(--cobalt),0_0_0_1px_var(--cobalt-bright)] active:translate-y-0 active:scale-x-[1.04] active:scale-y-[0.9] motion-reduce:active:scale-100"
    >
      <span className="grid size-8 place-items-center rounded-full bg-cobalt text-[13px] text-paper transition-transform duration-[var(--dur-base)] ease-squish group-hover:rotate-12">
        <Mark />
      </span>
      {children}
    </a>
  );
}
