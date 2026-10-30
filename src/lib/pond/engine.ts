import { createCaustics, type Caustics } from "./caustics";
import { Koi, varieties } from "./koi";
import { createRandom } from "./random";
import { paintFloor, paintFronds } from "./scenery";

const SEED = 20261030;
const KOI_COUNT = 5;
// Caustics are soft, so they render at a reduced resolution and the browser scales them up.
const CAUSTIC_SCALE = 0.5;
const CAUSTIC_CELLS = 5;
const MAX_DPR = 1.75;
const RIPPLE_LIFE = 1.8;
const TRAIL_RIPPLE_GAP = 0.35;
const MAX_DT = 1 / 30;

type Layers = {
  floor: HTMLCanvasElement;
  water: HTMLCanvasElement;
  light: HTMLCanvasElement;
  fronds: HTMLCanvasElement;
};
type Ripple = { x: number; y: number; born: number; strength: number };

export type Pond = { destroy: () => void };

/**
 * Animated top-down pond: a static floor, koi that wander, dart and gather around the pointer,
 * ripples on move and click, and caustic light over everything.
 */
export function createPond(host: HTMLElement, layers: Layers, opts: { animate: boolean }): Pond {
  const floorCtx = layers.floor.getContext("2d");
  const waterCtx = layers.water.getContext("2d");
  const frondCtx = layers.fronds.getContext("2d");
  if (!floorCtx || !waterCtx || !frondCtx) return { destroy() {} };
  const caustics: Caustics | null = createCaustics(layers.light, CAUSTIC_CELLS);

  let width = 0;
  let height = 0;
  let dpr = 1;
  let koi: Koi[] = [];
  const ripples: Ripple[] = [];
  let lure: { x: number; y: number } | null = null;
  let lastTrail = 0;
  let clock = 0;
  let frame = 0;
  let running = false;
  let visible = false;
  let last = 0;
  const rng = createRandom(SEED);

  const size = (canvas: HTMLCanvasElement, scale: number) => {
    canvas.width = Math.round(width * dpr * scale);
    canvas.height = Math.round(height * dpr * scale);
  };

  const layout = () => {
    const rect = host.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const first = width === 0;
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const sceneRng = createRandom(SEED);

    for (const c of [layers.floor, layers.water, layers.fronds]) size(c, 1);
    floorCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintFloor(floorCtx, width, height, sceneRng);
    frondCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintFronds(frondCtx, width, height, sceneRng);
    caustics?.resize(
      Math.round(width * dpr * CAUSTIC_SCALE),
      Math.round(height * dpr * CAUSTIC_SCALE),
    );

    if (first) {
      const len = Math.min(width, height) * 0.24;
      koi = Array.from(
        { length: KOI_COUNT },
        (_, i) =>
          new Koi(
            rng,
            rng.range(0.25, 0.75) * width,
            rng.range(0.25, 0.75) * height,
            len * rng.range(0.75, 1.1),
            varieties[i % varieties.length],
          ),
      );
      // Let the school settle into natural poses before the first paint.
      for (let s = 0; s < 90; s++) step(1 / 30);
    }
    draw();
  };

  const step = (dt: number) => {
    clock += dt;
    for (const fish of koi) fish.update(dt, clock, rng, width, height, lure, koi);
    for (let i = ripples.length - 1; i >= 0; i--) {
      if (clock - ripples[i].born > RIPPLE_LIFE) ripples.splice(i, 1);
    }
  };

  const draw = () => {
    waterCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    waterCtx.clearRect(0, 0, width, height);
    for (const fish of koi) fish.draw(waterCtx);
    for (const r of ripples) {
      const t = (clock - r.born) / RIPPLE_LIFE;
      for (const lag of [0, 0.18]) {
        const k = t - lag;
        if (k <= 0) continue;
        waterCtx.beginPath();
        waterCtx.arc(r.x, r.y, k * 70 * r.strength, 0, Math.PI * 2);
        waterCtx.strokeStyle = `rgba(235,250,225,${(1 - k) * 0.4 * r.strength})`;
        waterCtx.lineWidth = 1.5;
        waterCtx.stroke();
      }
    }
    caustics?.render(clock);
  };

  const tick = (now: number) => {
    const dt = Math.min(MAX_DT, (now - last) / 1000);
    last = now;
    step(dt);
    draw();
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running || !opts.animate) return;
    running = true;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(frame);
  };
  const sync = () => (visible && !document.hidden ? start() : stop());

  const local = (e: PointerEvent) => {
    const rect = host.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const onMove = (e: PointerEvent) => {
    lure = local(e);
    if (clock - lastTrail > TRAIL_RIPPLE_GAP) {
      ripples.push({ ...lure, born: clock, strength: 0.45 });
      lastTrail = clock;
    }
  };
  const onLeave = () => {
    lure = null;
  };
  const onDown = (e: PointerEvent) => {
    const p = local(e);
    ripples.push({ ...p, born: clock, strength: 1 });
    for (const fish of koi) {
      if (Math.hypot(fish.x - p.x, fish.y - p.y) < fish.length * 2.2) fish.dart(clock, p);
    }
  };

  layout();
  const resizeObserver = new ResizeObserver(layout);
  resizeObserver.observe(host);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  io.observe(host);
  document.addEventListener("visibilitychange", sync);
  if (opts.animate) {
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
  }

  return {
    destroy() {
      stop();
      resizeObserver.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      caustics?.dispose();
    },
  };
}
