export const GITHUB_LOGIN = "WebDevAmey";

export interface ContributionDay {
  contributionCount: number;
  date: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionMonth {
  name: string;
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
  months: ContributionMonth[];
  source: "graphql" | "public" | "none";
}

const EMPTY: ContributionCalendar = { totalContributions: 0, weeks: [], months: [], source: "none" };

/**
 * Loads the contribution calendar for the portfolio owner.
 *
 * 1. With a GITHUB_TOKEN env var, it asks the GraphQL API (exact counts, and
 *    private contributions are included when the token belongs to the same user).
 * 2. Without a token, it reads GitHub's public calendar page, which needs no auth.
 * 3. If both fail, it returns an empty calendar so the section still renders.
 */
export async function getContributionCalendar(login = GITHUB_LOGIN): Promise<ContributionCalendar> {
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    try {
      const calendar = await fetchFromGraphQL(login, token);
      if (calendar) return calendar;
    } catch (error) {
      console.warn("GitHub GraphQL contributions failed, falling back to public calendar", error);
    }
  }

  try {
    const calendar = await fetchFromPublicPage(login);
    if (calendar) return calendar;
  } catch (error) {
    console.warn("GitHub public contributions page failed", error);
  }

  return EMPTY;
}

async function fetchFromGraphQL(login: string, token: string): Promise<ContributionCalendar | null> {
  const query = `query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          months { name }
          weeks { contributionDays { contributionCount date } }
        }
      }
    }
  }`;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query, variables: { login } }),
  });

  if (!response.ok) throw new Error(`GraphQL responded ${response.status}`);

  const data = await response.json();
  const calendar = data?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar?.weeks) return null;

  return {
    totalContributions: calendar.totalContributions ?? 0,
    weeks: calendar.weeks,
    months: calendar.months ?? monthsFromWeeks(calendar.weeks),
    source: "graphql",
  };
}

async function fetchFromPublicPage(login: string): Promise<ContributionCalendar | null> {
  const response = await fetch(`https://github.com/users/${encodeURIComponent(login)}/contributions`, {
    headers: { Accept: "text/html", "User-Agent": "portfolio-contributions" },
  });

  if (!response.ok) throw new Error(`Public calendar responded ${response.status}`);

  return parseContributionsHtml(await response.text());
}

/** Parses the HTML that github.com/users/<login>/contributions returns. */
export function parseContributionsHtml(html: string): ContributionCalendar | null {
  // Tooltips carry the exact count: "No contributions on ..." or "5 contributions on ...".
  const counts = new Map<string, number>();
  for (const match of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const amount = match[2].trim().match(/^([\d,]+)\s+contributions?/i);
    counts.set(match[1], amount ? Number(amount[1].replace(/,/g, "")) : 0);
  }

  // Cells are ids like contribution-day-component-<weekday>-<week>.
  const columns = new Map<number, Array<{ row: number; day: ContributionDay }>>();
  for (const match of html.matchAll(/<td\b[^>]*\bdata-date="[^"]+"[^>]*>/g)) {
    const tag = match[0];
    const date = tag.match(/data-date="([^"]+)"/)?.[1];
    const id = tag.match(/\bid="([^"]+)"/)?.[1];
    const position = id?.match(/-(\d+)-(\d+)$/);
    if (!date || !id || !position) continue;

    const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0);
    const row = Number(position[1]);
    const column = Number(position[2]);
    // Fall back to a rough count from the colour level if a tooltip is missing.
    const contributionCount = counts.get(id) ?? level * 3;

    if (!columns.has(column)) columns.set(column, []);
    columns.get(column)!.push({ row, day: { date, contributionCount } });
  }

  if (columns.size === 0) return null;

  const weeks: ContributionWeek[] = [...columns.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, days]) => ({
      contributionDays: days.sort((a, b) => a.row - b.row).map(({ day }) => day),
    }));

  const summedTotal = weeks.reduce(
    (sum, week) => sum + week.contributionDays.reduce((acc, day) => acc + day.contributionCount, 0),
    0
  );
  const headline = html.match(/([\d,]+)\s+contributions?\s+in the last year/i);

  return {
    totalContributions: headline ? Number(headline[1].replace(/,/g, "")) : summedTotal,
    weeks,
    months: monthsFromWeeks(weeks),
    source: "public",
  };
}

function monthsFromWeeks(weeks: ContributionWeek[]): ContributionMonth[] {
  const names: ContributionMonth[] = [];
  let lastKey = "";
  for (const week of weeks) {
    const first = week.contributionDays[0];
    if (!first) continue;
    const key = first.date.slice(0, 7);
    if (key === lastKey) continue;
    lastKey = key;
    names.push({
      name: new Intl.DateTimeFormat("en", { month: "long", timeZone: "UTC" }).format(new Date(`${first.date}T00:00:00Z`)),
    });
  }
  return names;
}
