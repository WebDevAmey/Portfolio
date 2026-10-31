import { ContributionsChart } from "@/components/contributions-chart";
import { DailyQuote } from "@/components/daily-quote";
import { StackIcons } from "@/components/stack-icons";
import { site } from "@/data/site";
import { getContributions } from "@/lib/github";

const github = site.socials.find((s) => s.label === "GitHub")!;

export async function Stack() {
  const contributions = await getContributions(github.handle);
  return (
    <section id="stack" aria-labelledby="stack-title" className="column-wide pb-[var(--section-y)]">
      <div className="mx-auto max-w-[var(--measure)] text-center">
        <p className="mono-label mb-3">02 · Stack</p>
        <h2 id="stack-title" className="section-title">
          What I build with.
        </h2>
        <p className="mx-auto mt-3 max-w-[44ch] text-mute">
          The tools behind the projects above, and what I&apos;ve been shipping lately.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-[48rem]">
        <StackIcons />
      </div>

      <div className="mx-auto mt-10 max-w-[48rem]">
        <ContributionsChart data={contributions} profile={github.href} />
      </div>

      <div className="mx-auto mt-6 max-w-[48rem] rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-8">
        <DailyQuote />
      </div>
    </section>
  );
}
