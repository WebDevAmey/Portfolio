"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The page's one visual centrepiece. The engine loads after the page is interactive, so the
 * pond never delays the first paint; until then a still gradient holds the space.
 */
export function PondCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLCanvasElement>(null);
  const waterRef = useRef<HTMLCanvasElement>(null);
  const lightRef = useRef<HTMLCanvasElement>(null);
  const frondRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    const floor = floorRef.current;
    const water = waterRef.current;
    const light = lightRef.current;
    const fronds = frondRef.current;
    if (!host || !floor || !water || !light || !fronds) return;

    let pond: { destroy: () => void } | null = null;
    let cancelled = false;
    const boot = () =>
      import("@/lib/pond/engine").then(({ createPond }) => {
        if (cancelled) return;
        pond = createPond(host, { floor, water, light, fronds }, { animate: !reduced });
        host.dataset.ready = "true";
      });
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const handle = idle(boot);

    return () => {
      cancelled = true;
      (window.cancelIdleCallback ?? window.clearTimeout)(handle);
      pond?.destroy();
    };
  }, [reduced]);

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label="An animated pond seen from above: koi glide over stones while light ripples across the water. Move the pointer or tap to make ripples."
      className="pond relative aspect-square w-full touch-pan-y overflow-hidden rounded-[2rem] bg-[radial-gradient(ellipse_at_50%_45%,#3a6447,#1b3424_75%)] sm:aspect-auto sm:h-[clamp(22rem,56svh,36rem)]"
    >
      <canvas ref={floorRef} aria-hidden="true" className="absolute inset-0 size-full" />
      <canvas ref={waterRef} aria-hidden="true" className="absolute inset-0 size-full" />
      <canvas
        ref={lightRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full opacity-50 mix-blend-screen"
      />
      <canvas
        ref={frondRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full"
      />
    </div>
  );
}
