import type { Random } from "./random";

const TAU = Math.PI * 2;

/** Water, pond-floor speckle and stones. Drawn once per resize into the base canvas. */
export function paintFloor(ctx: CanvasRenderingContext2D, w: number, h: number, rng: Random) {
  const water = ctx.createRadialGradient(
    w * 0.5,
    h * 0.45,
    0,
    w * 0.5,
    h * 0.5,
    Math.max(w, h) * 0.75,
  );
  water.addColorStop(0, "#3a6447");
  water.addColorStop(0.55, "#2c5038");
  water.addColorStop(1, "#1b3424");
  ctx.fillStyle = water;
  ctx.fillRect(0, 0, w, h);

  // Fine gravel: thousands of tiny light and dark specks.
  const specks = Math.round((w * h) / 90);
  for (let i = 0; i < specks; i++) {
    const light = rng.next() < 0.45;
    ctx.fillStyle = light
      ? `rgba(190,215,170,${rng.range(0.04, 0.12)})`
      : `rgba(8,22,12,${rng.range(0.08, 0.22)})`;
    const s = rng.range(0.6, 2.2);
    ctx.fillRect(rng.range(0, w), rng.range(0, h), s, s);
  }

  // Smooth river stones with a contact shadow and a soft top light.
  const unit = Math.min(w, h);
  const stones = 5;
  for (let i = 0; i < stones; i++) {
    const x = rng.range(0.12, 0.88) * w;
    const y = rng.range(0.15, 0.85) * h;
    const rx = unit * rng.range(0.035, 0.07);
    const ry = rx * rng.range(0.7, 0.9);
    const rot = rng.range(0, TAU);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(rx * 0.18, ry * 0.3, rx * 1.05, ry * 1.05, 0, 0, TAU);
    ctx.fillStyle = "rgba(6,16,10,0.4)";
    ctx.filter = `blur(${Math.max(1, rx * 0.2)}px)`;
    ctx.fill();
    ctx.filter = "none";

    const body = ctx.createRadialGradient(-rx * 0.3, -ry * 0.35, rx * 0.05, 0, 0, rx * 1.1);
    const tone = rng.range(0.85, 1.15);
    body.addColorStop(0, `rgb(${150 * tone},${158 * tone},${132 * tone})`);
    body.addColorStop(0.55, `rgb(${84 * tone},${92 * tone},${74 * tone})`);
    body.addColorStop(1, `rgb(${34 * tone},${42 * tone},${32 * tone})`);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
    ctx.fillStyle = body;
    ctx.fill();
    ctx.restore();
  }

  // Darken toward the rim so the feathered edge reads as depth.
  const rim = ctx.createRadialGradient(
    w / 2,
    h / 2,
    Math.min(w, h) * 0.3,
    w / 2,
    h / 2,
    Math.max(w, h) * 0.65,
  );
  rim.addColorStop(0, "rgba(0,0,0,0)");
  rim.addColorStop(1, "rgba(4,14,8,0.45)");
  ctx.fillStyle = rim;
  ctx.fillRect(0, 0, w, h);
}

/** Long grass blades leaning in from the edges, drawn above the water. */
export function paintFronds(ctx: CanvasRenderingContext2D, w: number, h: number, rng: Random) {
  ctx.clearRect(0, 0, w, h);
  const unit = Math.min(w, h);
  const clumps = [
    { x: 0, y: h * 0.15, dir: 0.35 },
    { x: w * 0.1, y: h, dir: -0.9 },
    { x: w, y: h * 0.82, dir: Math.PI + 0.35 },
    { x: w * 0.82, y: 0, dir: Math.PI * 0.62 },
    { x: 0, y: h * 0.72, dir: -0.25 },
  ];
  for (const clump of clumps) {
    const blades = 6 + Math.floor(rng.next() * 5);
    for (let i = 0; i < blades; i++) {
      const a = clump.dir + rng.range(-0.45, 0.45);
      const len = unit * rng.range(0.16, 0.34);
      const bend = rng.range(-0.5, 0.5);
      const width = unit * rng.range(0.008, 0.016);
      const ox = clump.x + rng.range(-1, 1) * unit * 0.04;
      const oy = clump.y + rng.range(-1, 1) * unit * 0.04;
      const tipX = ox + Math.cos(a) * len;
      const tipY = oy + Math.sin(a) * len;
      const midA = a + bend;
      const cx = ox + Math.cos(midA) * len * 0.55;
      const cy = oy + Math.sin(midA) * len * 0.55;
      const nx = -Math.sin(a) * width;
      const ny = Math.cos(a) * width;

      ctx.beginPath();
      ctx.moveTo(ox + nx, oy + ny);
      ctx.quadraticCurveTo(cx + nx * 0.6, cy + ny * 0.6, tipX, tipY);
      ctx.quadraticCurveTo(cx - nx * 0.6, cy - ny * 0.6, ox - nx, oy - ny);
      ctx.closePath();
      const g = ctx.createLinearGradient(ox, oy, tipX, tipY);
      g.addColorStop(0, "rgba(14,34,18,0.95)");
      g.addColorStop(1, `rgba(${46 + rng.range(0, 30)},${90 + rng.range(0, 30)},52,0.9)`);
      ctx.fillStyle = g;
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = width * 2;
      ctx.shadowOffsetY = width;
      ctx.fill();
    }
  }
  ctx.shadowColor = "transparent";
}
