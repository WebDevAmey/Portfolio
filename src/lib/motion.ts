// Mirrors the motion tokens in src/styles/tokens.css for animations driven from JS.
export const duration = {
  fast: 140,
  base: 260,
  slow: 520,
  burst: 900,
} as const;

export const easing = {
  out: "cubic-bezier(0.22, 1, 0.36, 1)",
  in: "cubic-bezier(0.55, 0, 0.75, 0.2)",
  squish: "cubic-bezier(0.3, 1.6, 0.4, 1)",
  spring:
    "linear(0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.723 12.9%, 0.938 16.7%, 1.017, 1.077 22.4%, 1.104 25.3%, 1.108 27.6%, 1.094 30.4%, 1.036 37.1%, 1.008 41.7%, 0.993 47.5%, 0.996 60.1%, 1)",
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
