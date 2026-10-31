// The footer's illustrated meadow, drawn as one SVG so every layer scales together.
// The wordmark sits between the far and near hills, so the terrain hides its lower half.

// Deterministic scatter so server and client render the same flowers.
const scatter = (count: number, seed: number) => {
  let s = seed;
  const next = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  return Array.from({ length: count }, () => ({ x: next(), y: next(), t: next() }));
};

// The near hill's top edge, used to plant flowers on the slope.
const hillY = (x: number) =>
  360 + 46 * Math.sin((x / 1440) * Math.PI * 2 + 2.2) + 18 * Math.sin(x / 120);

const flowers = scatter(46, 7).map(({ x, y, t }) => {
  const fx = 40 + x * 1360;
  return { x: fx, y: hillY(fx) + 26 + y * 120, r: 2.2 + t * 2.2, tone: Math.floor(t * 3) };
});
const fireflies = scatter(12, 31).map(({ x, y, t }) => ({
  x: 80 + x * 1280,
  y: 250 + y * 160,
  delay: -t * 9,
  duration: 7 + t * 6,
}));

const flowerFill = ["#ffffff", "#f6b8d2", "#ffe08a"];

function Crystal({
  x,
  y,
  scale,
  tilt,
  from,
  to,
}: {
  x: number;
  y: number;
  scale: number;
  tilt: number;
  from: string;
  to: string;
}) {
  const id = `gem-${x}`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${scale})`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      {/* Night glow behind the gem. */}
      <g className="meadow-night">
        <ellipse
          cx="0"
          cy="-40"
          rx="70"
          ry="80"
          fill={from}
          opacity="0.4"
          filter="url(#meadow-blur)"
        />
      </g>
      <path d="M0 -96 30 -44 18 0 -18 0 -30 -44Z" fill={`url(#${id})`} opacity="0.92" />
      <path d="M0 -96 30 -44 0 -30Z" fill="#ffffff" opacity="0.45" />
      <path d="M0 -30 30 -44 18 0Z" fill="#000000" opacity="0.08" />
      <path d="M0 -96 -30 -44 0 -30Z" fill="#ffffff" opacity="0.18" />
    </g>
  );
}

export function MeadowScene() {
  return (
    <svg
      viewBox="0 0 1440 560"
      preserveAspectRatio="xMidYMax slice"
      className="block size-full sm:h-auto"
      aria-hidden="true"
    >
      <defs>
        <filter id="meadow-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="meadow-soft" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <radialGradient id="meadow-sphere" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#d9d3f5" />
          <stop offset="1" stopColor="#9d8fd6" />
        </radialGradient>
        <linearGradient id="meadow-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--hill-front)" }} />
          <stop offset="1" style={{ stopColor: "var(--hill-deep)" }} />
        </linearGradient>
        <clipPath id="meadow-word">
          <rect width="1440" height="452" />
        </clipPath>
        <mask id="meadow-crescent">
          <rect width="1440" height="560" fill="#fff" />
          <circle cx="1264" cy="204" r="30" fill="#000" />
        </mask>
      </defs>

      {/* Sun by day, moon by night. */}
      <g className="meadow-day">
        <circle cx="1250" cy="215" r="70" fill="#fff6d8" opacity="0.5" filter="url(#meadow-blur)" />
        <circle cx="1250" cy="215" r="34" fill="#fff4cf" />
      </g>
      <g className="meadow-night">
        <circle
          cx="1250"
          cy="215"
          r="60"
          fill="#dfe6ff"
          opacity="0.18"
          filter="url(#meadow-blur)"
        />
        <circle cx="1250" cy="215" r="30" fill="#eef1ff" mask="url(#meadow-crescent)" />
      </g>

      {/* Drifting clouds. */}
      <g className="meadow-cloud" fill="#ffffff" filter="url(#meadow-soft)">
        <g style={{ opacity: "var(--cloud-alpha)" }}>
          <ellipse cx="170" cy="236" rx="110" ry="20" />
          <ellipse cx="215" cy="222" rx="60" ry="24" />
          <ellipse cx="760" cy="250" rx="140" ry="18" />
          <ellipse cx="720" cy="240" rx="64" ry="20" />
        </g>
      </g>

      {/* Far hill. */}
      <path
        d="M0 300 C 220 240 420 250 640 286 S 1080 330 1240 270 1440 250 1440 250 V560 H0Z"
        style={{ fill: "var(--hill-back)" }}
      />

      {/* The wordmark, tucked behind the near hill. */}
      <text
        x="720"
        y="436"
        textAnchor="middle"
        clipPath="url(#meadow-word)"

        fontSize="372"
        fontWeight="600"
        letterSpacing="-22"
        style={{
          fill: "var(--wordmark)",
          fontFamily: "var(--ff-text), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        amey
      </text>

      {/* Near hill. */}
      <path
        d={`M0 ${hillY(0)} ${Array.from({ length: 49 }, (_, i) => {
          const x = i * 30;
          return `L${x} ${hillY(x).toFixed(1)}`;
        }).join(" ")} L1440 560 L0 560Z`}
        fill="url(#meadow-near)"
      />

      {/* Wildflowers; they glow after dark. */}
      <g>
        {flowers.map((f, i) => (
          <g key={i}>
            <circle
              className="meadow-night"
              cx={f.x}
              cy={f.y}
              r={f.r * 2.4}
              fill={flowerFill[f.tone]}
              fillOpacity="0.28"
            />
            <circle cx={f.x} cy={f.y} r={f.r} fill={flowerFill[f.tone]} />
          </g>
        ))}
      </g>

      {/* Crystals and a glass sphere resting on the slope. */}
      <Crystal x={250} y={hillY(250) + 30} scale={1} tilt={-8} from="#f7b3d2" to="#c98fe0" />
      <Crystal x={310} y={hillY(310) + 40} scale={0.6} tilt={14} from="#ffc9a1" to="#f08f6a" />
      <Crystal x={1150} y={hillY(1150) + 34} scale={1.15} tilt={6} from="#c8bbf5" to="#8f86e0" />
      <Crystal x={1215} y={hillY(1215) + 46} scale={0.55} tilt={-18} from="#b9e6ff" to="#7fb7f0" />
      <g>
        <g className="meadow-night">
          <circle
            cx="1040"
            cy={hillY(1040) + 6}
            r="70"
            fill="#c8bbf5"
            opacity="0.4"
            filter="url(#meadow-blur)"
          />
        </g>
        <ellipse cx="1040" cy={hillY(1040) + 34} rx="34" ry="7" fill="#000" opacity="0.15" />
        <circle cx="1040" cy={hillY(1040) + 6} r="30" fill="url(#meadow-sphere)" />
      </g>

      {/* Fireflies, only at night. */}
      <g className="meadow-night">
        {fireflies.map((f, i) => (
          <circle
            key={i}
            className="meadow-firefly"
            cx={f.x}
            cy={f.y}
            r="2.4"
            fill="#fff3b0"
            style={{ animationDelay: `${f.delay}s`, animationDuration: `${f.duration}s` }}
          />
        ))}
      </g>
    </svg>
  );
}
