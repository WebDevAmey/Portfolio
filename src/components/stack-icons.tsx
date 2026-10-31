import {
  siExpress,
  siFastapi,
  siLangchain,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siPrisma,
  siPython,
  siReact,
  siRedis,
  siShopify,
  siSocketdotio,
  siSqlite,
  siTailwindcss,
  siTypescript,
  siVite,
  type SimpleIcon,
} from "simple-icons";

// Ordered by how often each shows up across the projects on this site.
const stack: { icon: SimpleIcon; label: string }[] = [
  { icon: siTypescript, label: "TypeScript" },
  { icon: siReact, label: "React" },
  { icon: siNextdotjs, label: "Next.js" },
  { icon: siTailwindcss, label: "Tailwind CSS" },
  { icon: siNodedotjs, label: "Node.js" },
  { icon: siPython, label: "Python" },
  { icon: siLangchain, label: "LangChain" },
  { icon: siFastapi, label: "FastAPI" },
  { icon: siExpress, label: "Express" },
  { icon: siPrisma, label: "Prisma" },
  { icon: siMongodb, label: "MongoDB" },
  { icon: siRedis, label: "Redis" },
  { icon: siSqlite, label: "SQLite" },
  { icon: siSocketdotio, label: "Socket.IO" },
  { icon: siVite, label: "Vite" },
  { icon: siShopify, label: "Shopify" },
];

/** Logos sit in black at rest and take their brand colour on hover. */
export function StackIcons() {
  return (
    <ul className="flex flex-wrap justify-center gap-2">
      {stack.map(({ icon, label }) => (
        <li
          key={label}
          className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1.5 pr-3.5 pl-2.5 text-[length:var(--step-small)] transition-[border-color,transform] duration-[var(--dur-base)] ease-squish hover:-translate-y-0.5 hover:border-line-strong"
          style={{ "--brand": `#${icon.hex}` } as React.CSSProperties}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4 fill-fg transition-colors duration-[var(--dur-base)] group-hover:fill-[var(--brand)]"
            aria-hidden="true"
          >
            <path d={icon.path} />
          </svg>
          {label}
        </li>
      ))}
    </ul>
  );
}
