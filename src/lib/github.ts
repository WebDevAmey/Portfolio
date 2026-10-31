export type ContributionDay = { date: string; level: 0 | 1 | 2 | 3 | 4; count: number };
export type Contributions = { total: number; days: ContributionDay[] };

const DAY =
  /<td\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*\bid="([^"]+)"[^>]*\bdata-level="([0-4])"[^>]*>/g;
const TIP = /<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g;
const TOTAL = /([\d,]+)\s+contributions?\s+in the last year/;

/** Reads GitHub's public contribution calendar markup into days, oldest first. */
export function parseContributions(html: string): Contributions | null {
  const counts = new Map<string, number>();
  for (const [, id, text] of html.matchAll(TIP)) {
    const n = text.trim().match(/^([\d,]+)\s+contribution/);
    counts.set(id, n ? Number(n[1].replace(/,/g, "")) : 0);
  }
  const days: ContributionDay[] = [];
  for (const [, date, id, level] of html.matchAll(DAY)) {
    days.push({
      date,
      level: Number(level) as ContributionDay["level"],
      count: counts.get(id) ?? 0,
    });
  }
  if (days.length < 7) return null;
  days.sort((a, b) => a.date.localeCompare(b.date));
  const total = html.match(TOTAL);
  return {
    total: total ? Number(total[1].replace(/,/g, "")) : days.reduce((sum, d) => sum + d.count, 0),
    days,
  };
}

/** Fetched at build time and refreshed once a day; null if GitHub can't be reached. */
export async function getContributions(user: string): Promise<Contributions | null> {
  try {
    const res = await fetch(`https://github.com/users/${user}/contributions`, {
      headers: { "user-agent": "ameytarmale.site" },
      next: { revalidate: 86_400 },
    });
    if (!res.ok) return null;
    return parseContributions(await res.text());
  } catch {
    return null;
  }
}
