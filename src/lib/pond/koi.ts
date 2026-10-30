import type { Random } from "./random";

type Point = { x: number; y: number };

type Patch = { t: number; side: number; r: number; color: string };

export type KoiVariety = { base: string; fin: string; patches: (rng: Random) => Patch[] };

const ORANGE = "#e4682c";
const RED = "#d5502a";
const CREAM = "#f4efe4";
const GOLD = "#e7ad45";
const INK = "#1d1b19";

const patchRun = (rng: Random, color: string, count: number, from = 0.08, to = 0.7, size = 0.9) =>
  Array.from({ length: count }, () => ({
    t: rng.range(from, to),
    side: rng.range(-0.6, 0.6),
    r: rng.range(0.45, 0.9) * size,
    color,
  }));

/** Original takes on classic koi colourings, built from simple patches clipped to the body. */
export const varieties: KoiVariety[] = [
  { base: CREAM, fin: "rgba(244,239,228,0.55)", patches: (rng) => patchRun(rng, RED, 4) },
  { base: GOLD, fin: "rgba(240,190,90,0.5)", patches: () => [] },
  {
    base: CREAM,
    fin: "rgba(244,239,228,0.55)",
    patches: (rng) => [...patchRun(rng, ORANGE, 3), ...patchRun(rng, INK, 4, 0.2, 0.75, 0.45)],
  },
  {
    base: ORANGE,
    fin: "rgba(240,140,80,0.5)",
    patches: (rng) => patchRun(rng, CREAM, 3, 0.15, 0.8, 0.8),
  },
  {
    base: CREAM,
    fin: "rgba(244,239,228,0.55)",
    patches: () => [{ t: 0.1, side: 0, r: 0.8, color: RED }],
  },
];

const SEGMENTS = 14;
const TAU = Math.PI * 2;

export class Koi {
  x: number;
  y: number;
  angle: number;
  speed: number;
  readonly baseSpeed: number;
  readonly length: number;
  private turn = 0;
  private targetTurn = 0;
  private nextTurnAt = 0;
  private phase: number;
  private burstUntil = 0;
  private spine: Point[];
  private readonly patches: Patch[];

  constructor(
    rng: Random,
    x: number,
    y: number,
    length: number,
    private readonly variety: KoiVariety,
  ) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.angle = rng.range(0, TAU);
    this.baseSpeed = length * rng.range(0.32, 0.48);
    this.speed = this.baseSpeed;
    this.phase = rng.range(0, TAU);
    this.patches = variety.patches(rng);
    const seg = length / SEGMENTS;
    this.spine = Array.from({ length: SEGMENTS + 1 }, (_, i) => ({
      x: x - Math.cos(this.angle) * seg * i,
      y: y - Math.sin(this.angle) * seg * i,
    }));
  }

  /** Short burst of speed, used for random darts and when a ripple startles the fish. */
  dart(now: number, awayFrom?: Point) {
    this.burstUntil = now + 0.9;
    if (awayFrom) this.angle = Math.atan2(this.y - awayFrom.y, this.x - awayFrom.x);
  }

  update(
    dt: number,
    now: number,
    rng: Random,
    width: number,
    height: number,
    lure: Point | null,
    others: Koi[],
  ) {
    // Wander: pick a new gentle turn every few seconds and ease toward it.
    if (now > this.nextTurnAt) {
      this.targetTurn = rng.range(-0.7, 0.7);
      this.nextTurnAt = now + rng.range(1.5, 4);
      if (rng.next() < 0.08) this.dart(now);
    }
    this.turn += (this.targetTurn - this.turn) * Math.min(1, dt * 1.5);
    let steer = this.turn;

    // Keep away from the feathered edges by turning toward the middle.
    const margin = Math.min(width, height) * 0.16;
    if (this.x < margin || this.x > width - margin || this.y < margin || this.y > height - margin) {
      steer += angleTo(this.angle, Math.atan2(height / 2 - this.y, width / 2 - this.x)) * 1.8;
    }

    // Curious fish drift toward a resting pointer.
    if (lure) {
      const d = Math.hypot(lure.x - this.x, lure.y - this.y);
      if (d < this.length * 4 && d > this.length * 0.6) {
        steer += angleTo(this.angle, Math.atan2(lure.y - this.y, lure.x - this.x)) * 0.9;
      }
    }

    // Light separation so fish do not swim through each other.
    for (const other of others) {
      if (other === this) continue;
      const d = Math.hypot(other.x - this.x, other.y - this.y);
      if (d < this.length * 0.9) {
        steer += angleTo(this.angle, Math.atan2(this.y - other.y, this.x - other.x)) * 0.8;
      }
    }

    this.angle += clamp(steer, -2.2, 2.2) * dt;
    const target = now < this.burstUntil ? this.baseSpeed * 3.2 : this.baseSpeed;
    this.speed += (target - this.speed) * Math.min(1, dt * 2.5);
    this.x += Math.cos(this.angle) * this.speed * dt;
    this.y += Math.sin(this.angle) * this.speed * dt;
    this.phase += dt * (3 + (this.speed / this.baseSpeed) * 4);

    // Follow-the-leader spine gives the body a natural bend through turns.
    const seg = this.length / SEGMENTS;
    this.spine[0] = { x: this.x, y: this.y };
    for (let i = 1; i < this.spine.length; i++) {
      const prev = this.spine[i - 1];
      const cur = this.spine[i];
      const a = Math.atan2(cur.y - prev.y, cur.x - prev.x);
      this.spine[i] = { x: prev.x + Math.cos(a) * seg, y: prev.y + Math.sin(a) * seg };
    }
  }

  private outline() {
    const n = this.spine.length;
    const left: Point[] = [];
    const right: Point[] = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const a = this.spine[Math.max(0, i - 1)];
      const b = this.spine[Math.min(n - 1, i + 1)];
      const ang = Math.atan2(b.y - a.y, b.x - a.x);
      const sway = Math.sin(this.phase - t * 3.2) * this.length * 0.05 * t * t;
      const width =
        this.length * 0.11 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 0.82 + 0.1)), 0.75);
      const nx = -Math.sin(ang);
      const ny = Math.cos(ang);
      const cx = this.spine[i].x + nx * sway;
      const cy = this.spine[i].y + ny * sway;
      left.push({ x: cx + nx * width, y: cy + ny * width });
      right.push({ x: cx - nx * width, y: cy - ny * width });
    }
    return { left, right };
  }

  private bodyPath(ctx: CanvasRenderingContext2D, left: Point[], right: Point[]) {
    ctx.beginPath();
    ctx.moveTo(left[0].x, left[0].y);
    for (let i = 1; i < left.length - 1; i++) {
      const mx = (left[i].x + left[i + 1].x) / 2;
      const my = (left[i].y + left[i + 1].y) / 2;
      ctx.quadraticCurveTo(left[i].x, left[i].y, mx, my);
    }
    ctx.lineTo(right[right.length - 1].x, right[right.length - 1].y);
    for (let i = right.length - 2; i > 0; i--) {
      const mx = (right[i].x + right[i - 1].x) / 2;
      const my = (right[i].y + right[i - 1].y) / 2;
      ctx.quadraticCurveTo(right[i].x, right[i].y, mx, my);
    }
    // Rounded snout.
    const head = this.spine[0];
    ctx.quadraticCurveTo(
      head.x + Math.cos(this.angle) * this.length * 0.08,
      head.y + Math.sin(this.angle) * this.length * 0.08,
      left[0].x,
      left[0].y,
    );
    ctx.closePath();
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { left, right } = this.outline();
    const n = this.spine.length;
    const tail = this.spine[n - 1];
    const beforeTail = this.spine[n - 3];
    const tailAngle = Math.atan2(tail.y - beforeTail.y, tail.x - beforeTail.x);
    const flick = Math.sin(this.phase - 3.2) * 0.45;
    const L = this.length;

    // Tail fin: a soft fan that sways with the body.
    ctx.fillStyle = this.variety.fin;
    for (const side of [-1, 1]) {
      const a = tailAngle + flick + side * 0.45;
      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      ctx.quadraticCurveTo(
        tail.x + Math.cos(a - side * 0.25) * L * 0.18,
        tail.y + Math.sin(a - side * 0.25) * L * 0.18,
        tail.x + Math.cos(a) * L * 0.26,
        tail.y + Math.sin(a) * L * 0.26,
      );
      ctx.quadraticCurveTo(
        tail.x + Math.cos(tailAngle + flick) * L * 0.12,
        tail.y + Math.sin(tailAngle + flick) * L * 0.12,
        tail.x,
        tail.y,
      );
      ctx.fill();
    }

    // Pectoral fins paddle just behind the head.
    const root = this.spine[3];
    const flap = 0.5 + Math.sin(this.phase * 0.7) * 0.25;
    for (const side of [-1, 1]) {
      const a = this.angle + Math.PI + side * (0.9 + flap * 0.4);
      ctx.beginPath();
      ctx.ellipse(
        root.x + Math.cos(a) * L * 0.1,
        root.y + Math.sin(a) * L * 0.1,
        L * 0.11,
        L * 0.045,
        a,
        0,
        TAU,
      );
      ctx.fill();
    }

    // Body with a soft shadow on the pond floor.
    ctx.save();
    ctx.shadowColor = "rgba(5, 18, 10, 0.45)";
    ctx.shadowBlur = L * 0.12;
    ctx.shadowOffsetX = L * 0.08;
    ctx.shadowOffsetY = L * 0.12;
    this.bodyPath(ctx, left, right);
    ctx.fillStyle = this.variety.base;
    ctx.fill();
    ctx.restore();

    // Markings, clipped to the body.
    ctx.save();
    this.bodyPath(ctx, left, right);
    ctx.clip();
    for (const p of this.patches) {
      const i = Math.min(n - 1, Math.round(p.t * (n - 1)));
      const l = left[i];
      const r = right[i];
      const x = (l.x + r.x) / 2 + ((l.x - r.x) / 2) * p.side;
      const y = (l.y + r.y) / 2 + ((l.y - r.y) / 2) * p.side;
      ctx.beginPath();
      ctx.ellipse(x, y, L * 0.09 * p.r, L * 0.065 * p.r, this.angle, 0, TAU);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    // Back highlight sells the rounded body.
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = L * 0.03;
    ctx.beginPath();
    ctx.moveTo(this.spine[1].x, this.spine[1].y);
    for (let i = 2; i < n - 2; i++) ctx.lineTo(this.spine[i].x, this.spine[i].y);
    ctx.stroke();
    ctx.restore();

    // Eyes.
    ctx.fillStyle = "rgba(20,20,18,0.8)";
    const eye = this.spine[1];
    for (const side of [-1, 1]) {
      const a = this.angle + side * 1.35;
      ctx.beginPath();
      ctx.arc(eye.x + Math.cos(a) * L * 0.06, eye.y + Math.sin(a) * L * 0.06, L * 0.012, 0, TAU);
      ctx.fill();
    }
  }
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/** Signed shortest rotation from angle `from` to angle `to`. */
function angleTo(from: number, to: number) {
  let d = (to - from) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d < -Math.PI) d += TAU;
  return d;
}
