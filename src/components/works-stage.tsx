"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

import type { Project } from "@/data/projects";

const QUERY = "(min-width: 1024px) and (pointer: fine)";

// The ring's code only loads where it is shown, so phones and tablets never download or hydrate it.
const WorksRing = dynamic(() => import("./works-ring").then((m) => m.WorksRing), { ssr: false });

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

export function WorksStage({ projects }: { projects: Project[] }) {
  const wide = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
  return (
    <div className="hidden h-[min(100svh,62rem)] min-h-[44rem] lg:pointer-fine:block">
      {wide && <WorksRing projects={projects} />}
    </div>
  );
}
