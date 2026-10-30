import type { IconName } from "@/components/icons";

export const site = {
  name: "Amey Tarmale",
  shortName: "Amey",
  role: "Founder and developer",
  url: "https://www.ameytarmale.site",
  description:
    "Amey Tarmale is a CS student at MIT-WPU Pune and the founder and developer of OVRT. He builds products, agents and interfaces for founders and developers.",
  email: "ameytarmale7@gmail.com",
  // TODO(Amey): point this at /resume.pdf once a resume is added to public/.
  resumeUrl: "https://www.linkedin.com/in/amey-tarmale-64b499241",
  status: "Building OVRT · open to collaborations",
  location: "Pune, India",
  socials: [
    { label: "GitHub", href: "https://github.com/WebDevAmey", handle: "WebDevAmey" },
    { label: "X", href: "https://x.com/ameytwtcorp", handle: "@ameytwtcorp" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/amey-tarmale-64b499241",
      handle: "amey-tarmale",
    },
  ],
  twitter: "@ameytwtcorp",
} as const;

export const nav = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
  { label: "Resume", href: site.resumeUrl, external: true },
] as const;

// REVIEW(Amey): draft about copy, written from the old site bio and the brief.
export const about = [
  "I'm Amey, a third-year Computer Science student at MIT-WPU in Pune, and the founder and developer behind OVRT, a decision-intelligence platform that shows Indian D2C founders on Shopify where their growth is leaking.",
  "My days are split between shipping the product, talking to founders and running growth experiments, which keeps me honest about what actually matters.",
  "On the side I build open-source tools like Textlab and low-level experiments like a Raft key-value store, mostly to understand things all the way down.",
  "I care about software that is fast, readable and quietly delightful to use.",
] as const;

export const facts = [
  { label: "Based", value: "Pune, India" },
  { label: "Studying", value: "B.Tech CSE, MIT-WPU (third year)" },
  { label: "Building", value: "OVRT" },
  { label: "Works in", value: "TypeScript, React, Next.js, Node, Python" },
] as const;

export type HeroWord = { word: string; icon: IconName };

/** Each slot cycles through its words. The first word of each forms the static sentence. */
export const heroSlots: HeroWord[][] = [
  [
    { word: "products", icon: "cube" },
    { word: "agents", icon: "orbit" },
    { word: "interfaces", icon: "window" },
    { word: "libraries", icon: "layers" },
  ],
  [
    { word: "founders", icon: "flag" },
    { word: "D2C brands", icon: "bag" },
    { word: "developers", icon: "brackets" },
    { word: "curious people", icon: "eye" },
  ],
  [
    { word: "motion", icon: "curve" },
    { word: "details", icon: "target" },
    { word: "latency", icon: "timer" },
    { word: "typography", icon: "glyph" },
  ],
  [
    { word: "Pune", icon: "pin" },
    { word: "the terminal", icon: "prompt" },
    { word: "first principles", icon: "axiom" },
    { word: "late nights", icon: "moon" },
  ],
];
