import { MARK_PATH } from "@/components/icons";
import { duration, easing } from "./motion";

const SHARD_COUNT = 28;
const DIAMOND_PATH = "M12 2 22 12 12 22 2 12Z";
const COLORS = ["var(--lime)", "var(--cobalt-bright)"];
const GRAVITY_PX = 60;

/**
 * Bursts small "A" and diamond shards out of `rect`. Returns when the burst has finished.
 * The layer is aria-hidden, ignores pointer events and removes itself.
 */
export function burstShards(rect: DOMRect): Promise<void> {
  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:90;overflow:hidden";
  document.body.appendChild(layer);

  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const animations: Animation[] = [];

  for (let i = 0; i < SHARD_COUNT; i++) {
    const size = 10 + Math.random() * 14;
    const shard = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    shard.setAttribute("viewBox", "0 0 24 24");
    shard.setAttribute("width", String(size));
    shard.setAttribute("height", String(size));
    shard.style.cssText = `position:absolute;left:${cx - size / 2}px;top:${cy - size / 2}px;filter:drop-shadow(0 6px 4px rgba(0,0,0,.55))`;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", i % 3 === 0 ? DIAMOND_PATH : MARK_PATH);
    path.style.fill = COLORS[i % COLORS.length];
    shard.appendChild(path);
    layer.appendChild(shard);

    // Spread around the full circle with jitter; start from a random point on the pill's edge.
    const angle = (i / SHARD_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const distance = 90 + Math.random() * 160;
    const sx = Math.cos(angle) * rect.width * 0.4;
    const sy = Math.sin(angle) * rect.height * 0.4;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    const spin = (Math.random() - 0.5) * 720;

    animations.push(
      shard.animate(
        [
          { transform: `translate(${sx}px, ${sy}px) rotate(0deg) scale(0.4)`, opacity: 1 },
          {
            transform: `translate(${sx + dx * 0.85}px, ${sy + dy * 0.85}px) rotate(${spin * 0.7}deg) scale(1)`,
            opacity: 1,
            offset: 0.55,
          },
          {
            transform: `translate(${sx + dx}px, ${sy + dy + GRAVITY_PX}px) rotate(${spin}deg) scale(0.6)`,
            opacity: 0,
          },
        ],
        {
          duration: duration.burst * (0.8 + Math.random() * 0.4),
          easing: easing.out,
          delay: Math.random() * 60,
          fill: "forwards",
        },
      ),
    );
  }

  return Promise.all(animations.map((a) => a.finished.catch(() => undefined))).then(() =>
    layer.remove(),
  );
}
