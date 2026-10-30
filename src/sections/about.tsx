import { about, facts } from "@/data/site";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="column pb-[var(--section-y)]">
      <p className="mono-label mb-3">02 · About</p>
      <h2 id="about-title" className="section-title">
        Builder, student, founder.
      </h2>
      <div className="mt-5 space-y-4 text-fg-2">
        {about.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <dl className="mt-10 grid border-t border-line sm:grid-cols-2 sm:gap-x-8">
        {facts.map((fact) => (
          <div key={fact.label} className="flex flex-col gap-1 border-b border-line py-4">
            <dt className="mono-label">{fact.label}</dt>
            <dd className="text-[length:var(--step-small)]">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
