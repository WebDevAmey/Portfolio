import type { SVGProps } from "react";

// Original 24px line icons. All inherit currentColor.
const paths = {
  cube: "M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Zm0 0v0M4 7.5l8 4.5 8-4.5M12 12v9",
  orbit:
    "M12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM4.5 8.5A8.5 8.5 0 0 1 19 7M19.5 15.5A8.5 8.5 0 0 1 5 17M19 7h.01M5 17h.01",
  window: "M3.5 5.5h17v13h-17zM3.5 9h17M9 9v9.5",
  layers: "M12 4 21 8.5 12 13 3 8.5 12 4ZM3 12.5l9 4.5 9-4.5M3 16.5 12 21l9-4.5",
  flag: "M5.5 21V4M5.5 4.5h11l-2.5 4 2.5 4h-11",
  bag: "M5 8h14l-1 12.5H6L5 8Zm4 0V6.5a3 3 0 0 1 6 0V8",
  brackets: "m8.5 7-5 5 5 5M15.5 7l5 5-5 5M13.5 5l-3 14",
  eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12ZM12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z",
  curve: "M3.5 18.5C8 18.5 9 5.5 20.5 5.5M3.5 18.5h.01M20.5 5.5h.01M14 5.5h6.5",
  target: "M12 4v4M12 16v4M4 12h4M16 12h4M12 6.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z",
  timer: "M12 8v5l3 2M9.5 2.5h5M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z",
  glyph: "M6 19.5h5M8.5 19.5 13 4.5h1l4.5 15M16 19.5h3M10.5 13.5h7",
  pin: "M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11Zm0-13.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z",
  prompt: "M3.5 5.5h17v13h-17zM7 10l2.5 2L7 14M12 14.5h4.5",
  axiom: "M12 4 20.5 19h-17L12 4Zm0 9.5h.01",
  moon: "M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z",
  xLogo: "M4.5 4.5 19.5 19.5M19.5 4.5 4.5 19.5",
  mail: "M3.5 6h17v12h-17zM3.5 6.5 12 13l8.5-6.5",
  sun: "M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7ZM12 2.5v2M12 19.5v2M4.5 12h-2M21.5 12h-2M6.7 6.7 5.3 5.3M18.7 18.7l-1.4-1.4M17.3 6.7l1.4-1.4M5.3 18.7l1.4-1.4",
  arrow: "M7 17 17 7M8.5 7H17v8.5",
  arrowRight: "M4.5 12h15M13.5 6l6 6-6 6",
  pause: "M8.5 5.5v13M15.5 5.5v13",
  play: "M7.5 5.5 18.5 12l-11 6.5v-13Z",
  shuffle:
    "M3.5 7h3.5c5 0 5 10 10 10h3.5M3.5 17h3.5c1.8 0 2.9-1.3 3.8-3M17.5 4.5 20.5 7l-3 2.5M17.5 14.5l3 2.5-3 2.5M13.3 10c.9-1.7 2-3 3.7-3h3.5",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}

/** Geometric "A" chevron: the site mark and one of the CTA shard shapes. */
export const MARK_PATH = "M2 22 12 2l10 20h-5.2L12 12.2 7.2 22H2Z";

export function Mark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={MARK_PATH} fill="currentColor" />
    </svg>
  );
}
