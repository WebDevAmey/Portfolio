export type ExperienceData = {
  title: string;
  role: string;
  dates: string;
  location: string;
  src: string;
  type?: string;
  imageFit?: "contain" | "cover";
  imageZoom?: number;
  description: string;
  tech: string[];
  metrics?: { label: string; value: string }[];
  screenshot?: string;
};

// TODO(Amey): add internships, jobs, and education here. These entries only
// cover work that is visible on github.com/WebDevAmey.
export const experiences: ExperienceData[] = [
  {
    title: "Freelance",
    role: "Freelance Developer",
    dates: "2025 - Present",
    location: "Remote",
    src: "https://github.com/webdevamey.png",
    imageFit: "cover",
    imageZoom: 1,
    // TODO(Amey): add client work you can share. Rows without a description,
    // tech, or metrics render without the expand control.
    description: "",
    tech: [],
  },
  {
    title: "Razorpay AI Buildathon 2026",
    role: "Builder, Track 05 (Open)",
    dates: "2026",
    location: "Remote",
    src: "https://github.com/webdevamey.png",
    imageFit: "cover",
    imageZoom: 1,
    description: `
      Built Seam, a revenue leak detective that joins a Shopify checkout funnel to the Razorpay payment rail and attributes every lost rupee to a specific cause
      Designed bounded, EV-gated recovery actions for the leaks worth fixing, behind a deterministic gate that a language model cannot talk its way around
      Documented the system with an architecture deep-dive and a build log alongside the code
    `,
    tech: ["TypeScript", "Shopify", "Razorpay", "AI Agents", "Render"],
  },
  {
    title: "Independent Projects",
    role: "Full-Stack Web Developer",
    dates: "2025 - Present",
    location: "Remote",
    src: "https://github.com/webdevamey.png",
    imageFit: "cover",
    imageZoom: 1,
    description: `
      Component libraries: built ButtonLab, a theme-aware gallery of 50+ interactive buttons with live previews and JSX/CSS/Tailwind export, and HoveraUI, a shadcn-compatible registry of animated components
      AI agents: built ResearchGraph, a LangGraph research agent that plans an investigation, scores sources, verifies quotes, and writes reports where every sentence links to its evidence
      Systems from scratch: built MiniKV (Raft consensus over raw TCP in TypeScript), loom (a sharded, WAL-backed concurrent KV store), and Gatekeep (a Redis token-bucket rate limiter using atomic Lua)
      Full-stack products: built Karagiri, an artisan marketplace on Node, Express and MongoDB, plus a Next.js mission planner for ArduPilot vehicles and the Cadence SaaS revenue dashboard
    `,
    tech: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "MongoDB",
      "Tailwind CSS",
      "Redis",
      "LangGraph",
    ],
    metrics: [
      { label: "ButtonLab Buttons", value: "50+" },
      { label: "Gatekeep Throughput", value: "~16k req/s" },
      { label: "Gatekeep Decision", value: "~25 µs" },
      { label: "Public Repos", value: "30+" },
    ],
  },
];
