import { SquishButton } from "@/components/squish-button";
import { site } from "@/data/site";

export function Contact() {
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent("Hello Amey")}`;
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden border-t border-line py-[var(--section-y)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1/2 left-1/2 h-[120%] w-[140%] -translate-x-1/2 bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--cobalt)_28%,transparent),transparent)]"
      />
      <div className="shell relative">
        <p className="mono-label mb-4">03 · Contact</p>
        <h2
          id="contact-title"
          className="max-w-[14ch] text-[length:var(--step-hero)] leading-[1.02] font-medium tracking-[-0.04em] text-balance [font-stretch:88%]"
        >
          Have something worth building?
        </h2>
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-6">
          <SquishButton href={mailto}>Get in touch</SquishButton>
          <p className="text-mute">
            or write to{" "}
            <a className="link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
