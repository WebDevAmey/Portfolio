import { SquishButton } from "@/components/squish-button";
import { site } from "@/data/site";

export function Contact() {
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent("Hello Amey")}`;
  return (
    <section id="contact" aria-labelledby="contact-title" className="column pb-[var(--section-y)]">
      <div className="rounded-[2rem] border border-line bg-surface px-6 py-12 text-center sm:px-12 sm:py-16">
        <p className="mono-label mb-3">03 · Contact</p>
        <h2
          id="contact-title"
          className="mx-auto max-w-[16ch] text-[length:var(--step-display)] leading-[1.1] font-semibold tracking-[-0.03em] text-balance"
        >
          Have something worth building?
        </h2>
        <p className="mx-auto mt-4 max-w-[36ch] text-mute">
          I&apos;m open to collaborations. Tell me what you&apos;re working on.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <SquishButton href={mailto}>Get in touch</SquishButton>
          <p className="text-[length:var(--step-small)] text-mute">
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
