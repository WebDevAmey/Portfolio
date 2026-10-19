import type { ComponentType } from "react";
import { Network, Search } from "lucide-react";
import {
  SiNextdotjs,
  SiTypescript,
  SiReact,
  SiThreedotjs,
  SiPrisma,
  SiCloudflare,
  SiLangchain,
  SiNodedotjs,
  SiFramer,
  SiTailwindcss,
  SiBun,
  SiEslint,
  SiRadixui,
  SiChartdotjs,
  SiGithub,
  SiFastapi,
  SiRedis,
  SiCelery,
  SiTldraw,
  SiCss,
  SiPython,
  SiAnthropic,
  SiClaude,
  SiGooglegemini,
  SiMeta,
} from "react-icons/si";

export type TechIcon = ComponentType<{ className?: string }>;
export type TechKey =
  | "next" | "ts" | "react" | "three" | "prisma" | "cloud" | "langchain" | "langgraph" | "rag"
  | "node" | "motion" | "tailwind" | "bun" | "eslint" | "radixui" | "charts" | "github" | "fastapi"
  | "redis" | "celery" | "tldraw" | "css3" | "python" | "anthropic" | "claude" | "gemini" | "llama";

export type TechItem = TechKey | { label: string; tooltip?: string; };

export interface Project {
  slug: string;
  title: string;
  imageTitle: string;
  src: string;
  lightModeSrc?: string;
  video: string;
  description: string;
  tech: TechItem[];
  github: string;
  live: string;
  starsText?: string;
  /** Shown under the description when the project is someone else's original work. */
  credit?: string;
  backgroundImage?: string;
  hasPin: boolean;
}

export const iconMap: Record<TechKey, TechIcon> = {
  next: SiNextdotjs, ts: SiTypescript, react: SiReact, three: SiThreedotjs, prisma: SiPrisma,
  cloud: SiCloudflare, langchain: SiLangchain, langgraph: Network, rag: Search, node: SiNodedotjs,
  motion: SiFramer, tailwind: SiTailwindcss, bun: SiBun, eslint: SiEslint, radixui: SiRadixui,
  charts: SiChartdotjs, github: SiGithub, fastapi: SiFastapi, redis: SiRedis, celery: SiCelery,
  tldraw: SiTldraw, css3: SiCss, python: SiPython, anthropic: SiAnthropic, claude: SiClaude,
  gemini: SiGooglegemini, llama: SiMeta,
};

export const techNames: Record<TechKey, string> = {
  next: "Next.js", ts: "TypeScript", react: "React", three: "Three.js", prisma: "Prisma",
  cloud: "Cloudflare", langchain: "LangChain", langgraph: "LangGraph", rag: "RAG",
  node: "Node.js", motion: "Framer Motion", tailwind: "Tailwind CSS", bun: "Bun", eslint: "ESLint",
  radixui: "Radix UI", charts: "Charts", github: "GitHub API", fastapi: "FastAPI", redis: "Redis",
  celery: "Celery", tldraw: "tldraw", css3: "CSS3", python: "Python", anthropic: "Anthropic",
  claude: "Claude", gemini: "Gemini", llama: "LLaMA",
};

export const projectsData: Project[] = [
  {
    slug: "textlab",
    title: "Textlab",
    imageTitle: "Homepage",
    src: "/project-image/textlab.webp",
    lightModeSrc: "/project-image/textlab-light.webp",
    video: "",
    description: "70 text effects for React, installed as source with the shadcn CLI. Every effect has a live preview and a calm preset, and the catalog is readable by AI tools through llms.txt and an MCP server.",
    tech: ["next", "react", "ts", "motion"],
    github: "https://github.com/WebDevAmey/textdesigns",
    // TODO(Amey): textdesigns.vercel.app returned DEPLOYMENT_NOT_FOUND on 2026-10-19; add the live URL once it is deployed.
    live: "",
    hasPin: true,
  },
  {
    slug: "mission-planner",
    title: "Mission Planner",
    imageTitle: "Landing page",
    src: "/project-image/flight-deck.webp",
    lightModeSrc: "/project-image/flight-deck-light.webp",
    video: "",
    description: "Flight Deck, a browser-based mission planner for ArduPilot. Draw an area on the map and get a validated, ground-station-ready mission: survey grids, route optimisation, no-fly zones, terrain checks, and exports for Mission Planner and QGroundControl.",
    tech: ["next", "react", "ts", "prisma", "langgraph", { label: "MapLibre" }],
    github: "https://github.com/WebDevAmey/mission-planner",
    // TODO(Amey): mission-planner.vercel.app serves a different app (a river-erosion risk map) as of 2026-10-19; add the Flight Deck URL once it is deployed.
    live: "",
    hasPin: true,
  },
  {
    slug: "system-design-mafia",
    title: "System Design Mafia",
    imageTitle: "Twitter architecture diagram",
    src: "/project-image/system-design-mafia.webp",
    video: "",
    description: "Free, open-source system design guides built around interactive architecture diagrams. Drag, zoom, and trace each edge through real designs like Twitter, WhatsApp, and YouTube, with a written breakdown of every trade-off.",
    tech: ["next", "react", "ts", "tailwind", { label: "React Flow" }],
    github: "https://github.com/WebDevAmey/system-design-mafia",
    live: "https://sdmafia.hdtl.in",
    credit: "Original project by Atharva Arbat",
    hasPin: true,
  },
  {
    slug: "researchgraph",
    title: "ResearchGraph",
    imageTitle: "Home",
    src: "/project-image/researchgraph.webp",
    video: "",
    description: "An autonomous research agent that plans an investigation, researches topics in parallel, scores every source, verifies its quotes, and writes a report where every sentence links back to its evidence.",
    tech: ["langgraph", "langchain", "claude", "python", "fastapi", "next", "tailwind"],
    github: "https://github.com/WebDevAmey/ResearchGraph",
    live: "",
    hasPin: true,
  },
  {
    slug: "seam",
    title: "Seam",
    imageTitle: "Cover",
    src: "/project-image/seam.webp",
    video: "",
    description: "A revenue leak detective for Shopify + Razorpay that attributes every lost rupee to a cause and runs EV-gated recovery behind a deterministic gate. Built for Razorpay's AI Buildathon 2026.",
    tech: ["next", "ts", "langgraph", "prisma", "tailwind", "motion"],
    github: "https://github.com/WebDevAmey/seam",
    live: "",
    hasPin: false,
  },
  {
    slug: "buttonlab",
    title: "ButtonLab",
    imageTitle: "Cover",
    src: "/project-image/buttonlab.webp",
    video: "",
    description: "A theme-aware gallery of 50+ interactive buttons with live previews, a prop playground, and copy-paste JSX, CSS, and Tailwind export.",
    tech: ["next", "ts", "tailwind", "motion", "radixui"],
    github: "https://github.com/WebDevAmey/ButtonLab",
    live: "",
    hasPin: false,
  },
  {
    slug: "minikv",
    title: "MiniKV",
    imageTitle: "Cover",
    src: "/project-image/minikv.webp",
    video: "",
    description: "A distributed key-value store built from scratch in TypeScript with a hand-rolled Raft implementation over raw TCP: leader election, log replication, quorum commits, and crash recovery.",
    tech: ["ts", "node"],
    github: "https://github.com/WebDevAmey/minikv",
    live: "",
    hasPin: false,
  },
  {
    slug: "hoveraui",
    title: "HoveraUI",
    imageTitle: "Cover",
    src: "/project-image/hoveraui.webp",
    video: "",
    description: "A shadcn-compatible component registry of animated buttons, backgrounds, loaders, and navbars, installable with the shadcn CLI.",
    tech: ["next", "react", "ts", "tailwind", "motion"],
    github: "https://github.com/WebDevAmey/HoveraUI",
    live: "",
    hasPin: false,
  },
  {
    slug: "gatekeep",
    title: "Gatekeep",
    imageTitle: "Cover",
    src: "/project-image/gatekeep.webp",
    video: "",
    description: "An API rate limiter built on a Redis-backed token bucket with atomic Lua execution, measured at ~16k req/s through the full limiter path on a local machine.",
    tech: ["node", "ts", "redis", { label: "Express" }],
    github: "https://github.com/WebDevAmey/Gatekeep",
    live: "",
    hasPin: false,
  },
  {
    slug: "cadence",
    title: "Cadence",
    imageTitle: "Dashboard",
    src: "/project-image/cadence.webp",
    video: "",
    description: "An open-source SaaS revenue operations dashboard for MRR/NRR tracking, account health, cohort retention, and customer signals.",
    tech: ["react", "ts", "tailwind", "charts", { label: "Vite" }],
    github: "https://github.com/WebDevAmey/cadence-dashboard",
    live: "",
    hasPin: false,
  },
  {
    slug: "karagiri",
    title: "Karagiri",
    imageTitle: "Cover",
    src: "/project-image/karagiri.webp",
    video: "",
    description: "A marketplace connecting local artisans with buyers: product listings, artisan storefronts, and discovery for small-scale makers.",
    tech: ["react", "node", { label: "Express" }, { label: "MongoDB" }, { label: "Socket.IO" }],
    github: "https://github.com/WebDevAmey/FSDL_MiniProject",
    live: "https://karagiri-azure.vercel.app",
    hasPin: false,
  },
  {
    slug: "ai-summit-explorer",
    title: "AI Summit Explorer",
    imageTitle: "Cover",
    src: "/project-image/ai-summit-explorer.webp",
    video: "",
    description: "Explore 470 sessions and 3,000+ speakers from the India AI Impact Summit 2026, filter by topic, day, and venue, and build a personal agenda.",
    tech: ["react", "ts", "tailwind", "radixui"],
    github: "https://github.com/WebDevAmey/ai-summit-agent",
    live: "https://ai-summit-agent.vercel.app",
    hasPin: false,
  },
  {
    slug: "loom",
    title: "loom",
    imageTitle: "Cover",
    src: "/project-image/loom.webp",
    video: "",
    description: "A concurrent in-memory key-value store for Node.js with 16 independently locked shards, a CRC32-checked binary TCP protocol, and WAL crash recovery.",
    tech: ["ts", "node"],
    github: "https://github.com/WebDevAmey/loom",
    live: "",
    hasPin: false,
  },
  {
    slug: "lead-agent",
    title: "Lead Agent",
    imageTitle: "Cover",
    src: "/project-image/lead-agent.webp",
    video: "",
    description: "Finds and ranks US Shopify stores likely run by a single founder, using pronoun-ratio scoring with a plain-English reason for every score.",
    tech: ["node", "next", { label: "SQLite" }],
    github: "https://github.com/WebDevAmey/Lead-Agent",
    live: "",
    hasPin: false,
  },
];
