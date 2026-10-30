"use client";

import { useEffect, useRef } from "react";

// How far the ring is pulled from the pointer toward the hovered card's center.
const MAGNET = 0.3;
// Fraction of the remaining distance covered per frame (at 60fps).
const FOLLOW = 0.22;
const SETTLE_PX = 0.1;

/**
 * Lime dot that trails a fine pointer and grows into a "View" ring over [data-cursor="view"] targets.
 * Purely decorative: the native cursor stays visible and nothing depends on it.
 */
export function CursorDot() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!el || !fine.matches || reduce.matches) return;

    let target = { x: -100, y: -100 };
    let pos = { ...target };
    let frame = 0;
    let magnet: HTMLElement | null = null;

    const tick = () => {
      let tx = target.x;
      let ty = target.y;
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        tx += (r.left + r.width / 2 - tx) * MAGNET;
        ty += (r.top + r.height / 2 - ty) * MAGNET;
      }
      pos = { x: pos.x + (tx - pos.x) * FOLLOW, y: pos.y + (ty - pos.y) * FOLLOW };
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (Math.abs(tx - pos.x) > SETTLE_PX || Math.abs(ty - pos.y) > SETTLE_PX || magnet) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (el.dataset.visible !== "true") {
        pos = { x: event.clientX, y: event.clientY };
        el.dataset.visible = "true";
      }
      target = { x: event.clientX, y: event.clientY };
      const hit =
        (event.target as Element | null)?.closest<HTMLElement>("[data-cursor='view']") ?? null;
      if (hit !== magnet) {
        magnet = hit;
        el.dataset.mode = hit ? "view" : "dot";
      }
      wake();
    };
    const onLeave = () => {
      el.dataset.visible = "false";
      magnet = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-visible="false"
      data-mode="dot"
      className="group/cursor pointer-events-none fixed top-0 left-0 z-[100] opacity-0 transition-opacity duration-[var(--dur-base)] data-[visible=true]:opacity-100"
    >
      <div className="grid size-2 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-lime transition-[width,height,background-color,border-color] duration-[var(--dur-base)] ease-squish group-data-[mode=view]/cursor:size-16 group-data-[mode=view]/cursor:border group-data-[mode=view]/cursor:border-lime group-data-[mode=view]/cursor:bg-ink/60 group-data-[mode=view]/cursor:backdrop-blur-sm">
        <span className="font-mono text-[10px] tracking-[0.14em] text-lime opacity-0 transition-opacity duration-[var(--dur-fast)] group-data-[mode=view]/cursor:opacity-100">
          VIEW
        </span>
      </div>
    </div>
  );
}
