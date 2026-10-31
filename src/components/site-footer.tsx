"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { projects } from "@/data/projects";
import { nav, site } from "@/data/site";
import { Icon, Mark, type IconName } from "./icons";
import { LocalTime } from "./local-time";
import hillsCutout from "@/assets/footer/hills-cutout.webp";
import hills from "@/assets/footer/hills.webp";

const socialIcons: Record<string, IconName> = { GitHub: "brackets", X: "xLogo" };

const linkClass =
  "inline-flex min-h-9 items-center gap-1.5 text-[length:var(--step-small)] text-[var(--on-mute)] transition-colors hover:text-[var(--on)]";

const pillClass =
  "inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[var(--chip-on)] px-3.5 font-medium transition-[background-color,transform] duration-[var(--dur-base)] ease-squish hover:-translate-y-0.5 active:scale-95";

const columns = [
  {
    title: "Navigate",
    links: nav.map((n) => ({ label: n.label, href: n.href, external: "external" in n })),
  },
  {
    title: "Work",
    links: projects
      .filter((p) => p.featured)
      .slice(0, 4)
      .map((p) => ({ label: p.name, href: `/projects/${p.slug}`, external: false })),
  },
  {
    title: "Elsewhere",
    links: site.socials.map((s) => ({ label: s.label, href: s.href, external: true })),
  },
];

/**
 * A frosted panel of links over a photo of rolling hills. The huge name rises from behind the
 * hills letter by letter when the footer scrolls into view (click the hills to replay it) and
 * drifts with the pointer.
 */
export function SiteFooter() {
  // null until observed, so without JS the name simply sits in place.
  const [risen, setRisen] = useState<boolean | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRisen(true);
          io.disconnect();
        } else {
          setRisen(false);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Gentle pointer parallax: the ground and the name drift by different amounts.
  const footerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;
    let frame = 0;
    const set = (x: number, y: number) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        footer.style.setProperty("--px", x.toFixed(3));
        footer.style.setProperty("--py", y.toFixed(3));
      });
    };
    const onMove = (e: PointerEvent) => {
      const r = footer.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const onLeave = () => set(0, 0);
    footer.addEventListener("pointermove", onMove);
    footer.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      footer.removeEventListener("pointermove", onMove);
      footer.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const replay = () => {
    setRisen(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setRisen(true)));
  };

  return (
    <footer
      ref={footerRef}
      className="meadow relative isolate overflow-hidden"
      data-risen={risen ?? undefined}
    >
      <div className="column-wide relative z-20 pt-14 sm:pt-20">
        <div className="meadow-panel grid gap-10 rounded-[2rem] p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
          <div className="max-w-[22rem]">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
              aria-label={`${site.name}, home`}
            >
              <span className="grid size-8 place-items-center rounded-[0.6rem] bg-[var(--on)] text-[13px] text-white">
                <Mark />
              </span>
              <span className="text-[length:var(--step-1)] font-semibold tracking-[-0.01em]">
                {site.name}
              </span>
            </Link>
            <p className="mt-4 text-[length:var(--step-small)] leading-relaxed">
              Building OVRT and small, careful tools for the web, one commit at a time from Pune.
            </p>
            <ul className="mt-5 -ml-2 flex items-center gap-1" aria-label="Social links">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener me"
                    aria-label={s.label}
                    className="grid size-10 place-items-center rounded-full transition-[background-color,transform] duration-[var(--dur-base)] ease-squish hover:-translate-y-0.5 hover:bg-[var(--chip-on)]"
                  >
                    {socialIcons[s.label] ? (
                      <Icon name={socialIcons[s.label]} className="text-[17px]" strokeWidth={2} />
                    ) : (
                      <span className="text-[15px] font-bold tracking-[-0.04em]">in</span>
                    )}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${site.email}`}
                  aria-label={`Email ${site.email}`}
                  className="grid size-10 place-items-center rounded-full transition-[background-color,transform] duration-[var(--dur-base)] ease-squish hover:-translate-y-0.5 hover:bg-[var(--chip-on)]"
                >
                  <Icon name="mail" className="text-[17px]" strokeWidth={2} />
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3 lg:gap-x-14">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="mb-2 text-[length:var(--step-small)] font-semibold">{col.title}</h2>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        {...(l.external ? { target: "_blank", rel: "noopener" } : {})}
                        className={linkClass}
                      >
                        {l.label}
                        {l.external && <Icon name="arrow" className="text-[0.8em]" />}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-[var(--chip-on)] pt-5 text-[length:var(--step-small)] lg:col-span-2">
            <p className="mr-auto font-medium">
              © {new Date().getFullYear()} {site.name}
              <span className="font-normal text-[var(--on-mute)]">
                {" "}
                · Pune <LocalTime /> IST
              </span>
            </p>
            <a href="#top" className={pillClass}>
              Back to top
              <Icon name="arrow" className="-rotate-45" />
            </a>
          </div>
        </div>
      </div>

      <div
        ref={sceneRef}
        onClick={replay}
        aria-hidden="true"
        className="[container-type:size] relative z-0 -mt-32 aspect-[4/5] w-full cursor-pointer select-none min-[480px]:aspect-[4/3] sm:-mt-16 md:aspect-[16/9] lg:-mt-28 lg:aspect-[2/1]"
      >
        <div className="meadow-cover absolute bottom-0 left-1/2 -translate-x-1/2">
          <div className="meadow-ground meadow-sky absolute inset-0">
            <Image
              src={hills}
              alt=""
              fill
              sizes="(min-width: 1024px) 100vw, 160vw"
              placeholder="blur"
              className="object-cover"
            />
          </div>
          <div className="meadow-name absolute inset-x-0 bottom-[26%] flex justify-center">
            <span className="meadow-word flex leading-[0.78] font-semibold tracking-[-0.065em] text-white">
              {Array.from("amey").map((letter, i) => (
                <span
                  key={i}
                  className="meadow-letter inline-block"
                  style={{ transitionDelay: `${i * 130}ms` }}
                >
                  {letter}
                </span>
              ))}
            </span>
          </div>
          <div className="meadow-ground absolute inset-0">
            <Image
              src={hillsCutout}
              alt=""
              fill
              sizes="(min-width: 1024px) 100vw, 160vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
