import type { ContributionDay, Contributions } from "@/lib/github";

const levelClass = ["bg-chip", "bg-[#c9c9c5]", "bg-[#94948f]", "bg-[#55554f]", "bg-fg"];
// Phones show the most recent weeks only, so the cells stay a readable size.
const MOBILE_WEEKS = 22;

const toWeeks = (days: ContributionDay[]) => {
  const weeks: (ContributionDay | null)[][] = [];
  let week: (ContributionDay | null)[] = Array(
    new Date(`${days[0].date}T00:00:00Z`).getUTCDay(),
  ).fill(null);
  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push(week);
  return weeks;
};

// Without data (GitHub unreachable at build time) the calendar renders empty.
const emptyYear = (): ContributionDay[] => {
  const end = new Date();
  return Array.from({ length: 371 }, (_, i) => {
    const d = new Date(end);
    d.setUTCDate(end.getUTCDate() - 370 + i);
    return { date: d.toISOString().slice(0, 10), level: 0, count: 0 };
  });
};

export function ContributionsChart({
  data,
  profile,
}: {
  data: Contributions | null;
  profile: string;
}) {
  const weeks = toWeeks(data?.days.length ? data.days : emptyYear());
  // A zero count usually means private contributions are hidden on GitHub, so it isn't shown.
  const label = data?.total
    ? `${data.total.toLocaleString("en-IN")} contributions on GitHub in the last year`
    : "Contributions on GitHub in the last year";

  return (
    <figure className="rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-6">
      <div role="img" aria-label={label} className="flex justify-center">
        <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
          {weeks.map((week, w) =>
            week.map((day, d) =>
              day ? (
                <span
                  key={day.date}
                  title={`${day.count || "No"} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                  className={`size-[10px] rounded-[2px] lg:size-[11px] ${levelClass[day.level]} ${w < weeks.length - MOBILE_WEEKS ? "max-sm:hidden" : ""}`}
                  style={{ gridRow: d + 1 }}
                />
              ) : (
                <span
                  key={`pad-${w}-${d}`}
                  className="size-[10px] lg:size-[11px]"
                  style={{ gridRow: d + 1 }}
                />
              ),
            ),
          )}
        </div>
      </div>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[length:var(--step-small)] text-mute">
        <a href={profile} target="_blank" rel="noopener me" className="link">
          {label}
        </a>
        <span className="inline-flex items-center gap-1" aria-hidden="true">
          Less
          {levelClass.map((c) => (
            <span key={c} className={`size-[10px] rounded-[2px] ${c}`} />
          ))}
          More
        </span>
      </figcaption>
    </figure>
  );
}
