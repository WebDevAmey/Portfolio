import { about, facts } from "@/data/site";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="border-t border-line py-[var(--section-y)]"
    >
      <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div>
          <p className="mono-label mb-4">02 · About</p>
          <h2
            id="about-title"
            className="text-[length:var(--step-3)] leading-[1.05] font-medium tracking-[-0.03em] [font-stretch:90%]"
          >
            Builder, student, <span className="text-cobalt-bright">founder.</span>
          </h2>
        </div>
        <div>
          <div className="max-w-[46ch] space-y-5 text-[length:var(--step-2)] leading-[1.4] tracking-[-0.01em] text-paper/90">
            {about.map((line, i) => (
              <p key={i} className={i === 0 ? "text-paper" : undefined}>
                {line}
              </p>
            ))}
          </div>
          <dl className="mt-14 grid gap-x-8 border-t border-line sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-1 border-b border-line py-4">
                <dt className="mono-label">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
