export type Quote = { id: number; text: string; author: string };

const MS_PER_DAY = 86_400_000;

export const isLeapYear = (year: number) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

/**
 * Day of the year (1-366) for the local calendar date of `date`.
 * Uses UTC arithmetic on local Y/M/D components, so DST shifts can never move the result.
 */
export function getDayOfYear(date: Date): number {
  const y = date.getFullYear();
  return (Date.UTC(y, date.getMonth(), date.getDate()) - Date.UTC(y, 0, 1)) / MS_PER_DAY + 1;
}

/** The quote whose id equals the local day of the year. Id 366 only appears on leap-year New Year's Eve. */
export function getQuoteForDate(date: Date, quotes: readonly Quote[]): Quote {
  const day = getDayOfYear(date);
  const quote = quotes.find((q) => q.id === day);
  if (!quote) throw new Error(`No quote for day ${day}`);
  return quote;
}

/** Milliseconds until the next local midnight (23h or 25h days around DST are handled by Date). */
export function msUntilNextMidnight(now: Date): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next.getTime() - now.getTime();
}
