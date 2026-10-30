export type ProjectImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type Project = {
  slug: string;
  name: string;
  kind: "Product" | "Library" | "Agent" | "Tool" | "Systems";
  /** One line, shown in the ring caption and the bento tiles. */
  summary: string;
  /** Full paragraph for the case study page. */
  description: string;
  role?: string;
  stack: string[];
  links: { live?: string; repo?: string };
  /** Without an image the card renders a generated placeholder. */
  image?: ProjectImage;
  featured: boolean;
  credit?: string;
};

const shot = (file: string, alt: string, width = 1440, height = 900): ProjectImage => ({
  src: `/project-image/${file}.webp`,
  width,
  height,
  alt,
});

export const projects: Project[] = [
  {
    slug: "ovrt",
    name: "OVRT",
    kind: "Product",
    summary: "Decision intelligence and AI growth analytics for Indian D2C Shopify founders.",
    description:
      "OVRT connects to a Shopify store and becomes one AI layer that watches traffic, customer conversations and revenue leaks. It runs store health checks around the clock, estimates what abandoned checkouts, failed payments and refunds are costing, answers customers on email and WhatsApp, and sends a weekly digest of what to fix first.",
    role: "Founder, developer and growth",
    stack: ["Next.js", "TypeScript", "Shopify", "LLM agents"],
    links: { live: "https://ovrt.in" },
    featured: true,
  },
  {
    slug: "textlab",
    name: "Textlab",
    kind: "Library",
    summary: "70 text effects for React, installed as source with the shadcn CLI.",
    description:
      "70 text effects for React, installed as source with the shadcn CLI. Every effect has a live preview and a calm preset, and the catalog is readable by AI tools through llms.txt and an MCP server.",
    stack: ["Next.js", "React", "TypeScript", "Motion"],
    links: {
      live: "https://typeforge-ten.vercel.app",
      repo: "https://github.com/WebDevAmey/textdesigns",
    },
    image: shot("textlab", "Textlab homepage with the headline Text, set in motion"),
    featured: true,
  },
  {
    slug: "mission-planner",
    name: "Mission Planner",
    kind: "Tool",
    summary: "Draw an area, get a validated ArduPilot mission ready for the ground station.",
    description:
      "Flight Deck, a browser-based mission planner for ArduPilot. Draw an area on the map and get a validated, ground-station-ready mission: survey grids, route optimisation, no-fly zones, terrain checks, and exports for Mission Planner and QGroundControl.",
    stack: ["Next.js", "React", "TypeScript", "Prisma", "LangGraph", "MapLibre"],
    links: {
      live: "https://mission-planner-eight.vercel.app",
      repo: "https://github.com/WebDevAmey/mission-planner",
    },
    image: shot("flight-deck", "Flight Deck landing page with a survey polygon drawn on a map"),
    featured: true,
  },
  {
    slug: "system-design-mafia",
    name: "System Design Mafia",
    kind: "Product",
    summary: "Open system design guides built around interactive architecture diagrams.",
    description:
      "Free, open-source system design guides built around interactive architecture diagrams. Drag, zoom, and trace each edge through real designs like Twitter, WhatsApp, and YouTube, with a written breakdown of every trade-off.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "React Flow"],
    links: {
      live: "https://sdmafia.hdtl.in",
      repo: "https://github.com/WebDevAmey/system-design-mafia",
    },
    image: shot(
      "system-design-mafia",
      "Interactive architecture diagram of Twitter with services and data stores",
      1560,
      887,
    ),
    featured: true,
    credit: "Original project by Atharva Arbat",
  },
  {
    slug: "researchgraph",
    name: "ResearchGraph",
    kind: "Agent",
    summary: "A research agent whose every sentence links back to verified evidence.",
    description:
      "An autonomous research agent that plans an investigation, researches topics in parallel, scores every source, verifies its quotes, and writes a report where every sentence links back to its evidence.",
    stack: ["LangGraph", "LangChain", "Claude", "Python", "FastAPI", "Next.js"],
    links: { repo: "https://github.com/WebDevAmey/ResearchGraph" },
    image: shot("researchgraph", "ResearchGraph home screen with a research question input"),
    featured: true,
  },
  {
    slug: "seam",
    name: "Seam",
    kind: "Agent",
    summary: "A revenue leak detective for Shopify and Razorpay stores.",
    description:
      "A revenue leak detective for Shopify + Razorpay that attributes every lost rupee to a cause and runs EV-gated recovery behind a deterministic gate. Built for Razorpay's AI Buildathon 2026.",
    stack: ["Next.js", "TypeScript", "LangGraph", "Prisma", "Tailwind CSS"],
    links: { repo: "https://github.com/WebDevAmey/seam" },
    featured: true,
  },
  {
    slug: "buttonlab",
    name: "ButtonLab",
    kind: "Library",
    summary: "50+ interactive buttons with a prop playground and code export.",
    description:
      "A theme-aware gallery of 50+ interactive buttons with live previews, a prop playground, and copy-paste JSX, CSS, and Tailwind export.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "Radix UI"],
    links: { repo: "https://github.com/WebDevAmey/ButtonLab" },
    featured: false,
  },
  {
    slug: "minikv",
    name: "MiniKV",
    kind: "Systems",
    summary: "A distributed key-value store with hand-rolled Raft over raw TCP.",
    description:
      "A distributed key-value store built from scratch in TypeScript with a hand-rolled Raft implementation over raw TCP: leader election, log replication, quorum commits, and crash recovery.",
    stack: ["TypeScript", "Node.js"],
    links: { repo: "https://github.com/WebDevAmey/minikv" },
    featured: false,
  },
  {
    slug: "hoveraui",
    name: "HoveraUI",
    kind: "Library",
    summary: "A shadcn-compatible registry of animated components.",
    description:
      "A shadcn-compatible component registry of animated buttons, backgrounds, loaders, and navbars, installable with the shadcn CLI.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Motion"],
    links: { repo: "https://github.com/WebDevAmey/HoveraUI" },
    featured: false,
  },
  {
    slug: "gatekeep",
    name: "Gatekeep",
    kind: "Systems",
    summary: "A Redis token-bucket rate limiter at ~16k req/s.",
    description:
      "An API rate limiter built on a Redis-backed token bucket with atomic Lua execution, measured at ~16k req/s through the full limiter path on a local machine.",
    stack: ["Node.js", "TypeScript", "Redis", "Express"],
    links: { repo: "https://github.com/WebDevAmey/Gatekeep" },
    featured: false,
  },
  {
    slug: "cadence",
    name: "Cadence",
    kind: "Product",
    summary: "A revenue operations dashboard for MRR, NRR and cohort retention.",
    description:
      "An open-source SaaS revenue operations dashboard for MRR/NRR tracking, account health, cohort retention, and customer signals.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    links: { repo: "https://github.com/WebDevAmey/cadence-dashboard" },
    image: shot("cadence", "Cadence dashboard with MRR, retention and revenue charts", 1452, 836),
    featured: false,
  },
  {
    slug: "karagiri",
    name: "Karagiri",
    kind: "Product",
    summary: "A marketplace that connects local artisans with buyers.",
    description:
      "A marketplace connecting local artisans with buyers: product listings, artisan storefronts, and discovery for small-scale makers.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Socket.IO"],
    links: {
      live: "https://karagiri-azure.vercel.app",
      repo: "https://github.com/WebDevAmey/FSDL_MiniProject",
    },
    featured: false,
  },
  {
    slug: "ai-summit-explorer",
    name: "AI Summit Explorer",
    kind: "Tool",
    summary: "470 sessions and 3,000+ speakers from the India AI Impact Summit, filterable.",
    description:
      "Explore 470 sessions and 3,000+ speakers from the India AI Impact Summit 2026, filter by topic, day, and venue, and build a personal agenda.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Radix UI"],
    links: {
      live: "https://ai-summit-agent.vercel.app",
      repo: "https://github.com/WebDevAmey/ai-summit-agent",
    },
    featured: false,
  },
  {
    slug: "loom",
    name: "loom",
    kind: "Systems",
    summary: "A sharded in-memory key-value store with WAL crash recovery.",
    description:
      "A concurrent in-memory key-value store for Node.js with 16 independently locked shards, a CRC32-checked binary TCP protocol, and WAL crash recovery.",
    stack: ["TypeScript", "Node.js"],
    links: { repo: "https://github.com/WebDevAmey/loom" },
    featured: false,
  },
  {
    slug: "lead-agent",
    name: "Lead Agent",
    kind: "Agent",
    summary: "Finds and ranks Shopify stores likely run by a single founder.",
    description:
      "Finds and ranks US Shopify stores likely run by a single founder, using pronoun-ratio scoring with a plain-English reason for every score.",
    stack: ["Node.js", "Next.js", "SQLite"],
    links: { repo: "https://github.com/WebDevAmey/Lead-Agent" },
    featured: false,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const getNextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
