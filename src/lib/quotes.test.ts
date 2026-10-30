import { describe, expect, it } from "vitest";

import quotes from "@/data/quotes.json";
import { getDayOfYear, getQuoteForDate, isLeapYear, msUntilNextMidnight } from "./quotes";

const HOUR = 3_600_000;
const normalise = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, "");

describe("quotes.json", () => {
  it("has 366 entries with ids 1 to 366", () => {
    expect(quotes).toHaveLength(366);
    expect(quotes.map((q) => q.id)).toEqual(Array.from({ length: 366 }, (_, i) => i + 1));
  });

  it("has unique ids", () => {
    expect(new Set(quotes.map((q) => q.id)).size).toBe(366);
  });

  it("has non-empty text and author for every entry", () => {
    for (const q of quotes) {
      expect(q.text.trim(), `id ${q.id}`).not.toBe("");
      expect(q.author.trim(), `id ${q.id}`).not.toBe("");
    }
  });

  it("has no duplicate text, ignoring case and punctuation", () => {
    expect(new Set(quotes.map((q) => normalise(q.text))).size).toBe(366);
  });

  it("keeps every quote at 160 characters or fewer", () => {
    for (const q of quotes) expect(q.text.length, `id ${q.id}`).toBeLessThanOrEqual(160);
  });
});

describe("isLeapYear", () => {
  it.each([
    [2024, true],
    [2025, false],
    [2028, true],
    [1900, false],
    [2000, true],
    [2100, false],
  ])("%i -> %s", (year, leap) => expect(isLeapYear(year)).toBe(leap));
});

describe("getDayOfYear", () => {
  it("maps the first and last day of common and leap years", () => {
    expect(getDayOfYear(new Date(2025, 0, 1))).toBe(1);
    expect(getDayOfYear(new Date(2025, 11, 31))).toBe(365);
    expect(getDayOfYear(new Date(2024, 11, 31))).toBe(366);
    expect(getDayOfYear(new Date(2100, 11, 31))).toBe(365);
  });

  it("counts 29 February and shifts March in leap years only", () => {
    expect(getDayOfYear(new Date(2024, 1, 29))).toBe(60);
    expect(getDayOfYear(new Date(2024, 2, 1))).toBe(61);
    expect(getDayOfYear(new Date(2025, 2, 1))).toBe(60);
  });

  it("is stable for every hour of a day, including midnight edges", () => {
    for (let h = 0; h < 24; h++) {
      expect(getDayOfYear(new Date(2025, 5, 15, h, 30))).toBe(166);
    }
    expect(getDayOfYear(new Date(2025, 5, 15, 0, 0, 0, 0))).toBe(166);
    expect(getDayOfYear(new Date(2025, 5, 15, 23, 59, 59, 999))).toBe(166);
  });

  // The test script runs this file under several TZ values (see package.json "test:tz").
  it("is unaffected by DST transitions in the current time zone", () => {
    const transitions = [
      [2025, 2, 9], // US spring forward
      [2025, 2, 30], // EU spring forward
      [2025, 9, 26], // EU fall back
      [2025, 10, 2], // US fall back
    ] as const;
    for (const [y, m, d] of transitions) {
      const expected = getDayOfYear(new Date(y, m, d, 12));
      expect(getDayOfYear(new Date(y, m, d, 0, 30))).toBe(expected);
      expect(getDayOfYear(new Date(y, m, d, 3, 30))).toBe(expected);
      expect(getDayOfYear(new Date(y, m, d, 23, 30))).toBe(expected);
      expect(getDayOfYear(new Date(y, m, d + 1, 0, 30))).toBe(expected + 1);
    }
  });
});

describe("getQuoteForDate", () => {
  it("returns the quote whose id equals the day of the year", () => {
    expect(getQuoteForDate(new Date(2025, 0, 1), quotes).id).toBe(1);
    expect(getQuoteForDate(new Date(2025, 6, 4), quotes).id).toBe(185);
  });

  it("is deterministic within a day and changes across midnight", () => {
    const morning = getQuoteForDate(new Date(2026, 9, 30, 0, 1), quotes);
    const night = getQuoteForDate(new Date(2026, 9, 30, 23, 59), quotes);
    const next = getQuoteForDate(new Date(2026, 9, 31, 0, 0), quotes);
    expect(morning).toBe(night);
    expect(next.id).toBe(morning.id + 1);
  });

  it("uses the extra quote only on 31 December of a leap year", () => {
    expect(getQuoteForDate(new Date(2024, 11, 31), quotes).id).toBe(366);
    expect(getQuoteForDate(new Date(2025, 11, 31), quotes).id).toBe(365);
  });
});

describe("msUntilNextMidnight", () => {
  it("counts down to the next local midnight", () => {
    expect(msUntilNextMidnight(new Date(2025, 5, 15, 23, 0))).toBe(HOUR);
    expect(msUntilNextMidnight(new Date(2025, 5, 15, 0, 0))).toBe(24 * HOUR);
  });

  it("stays within one DST-adjusted day across transitions", () => {
    for (const [y, m, d] of [
      [2025, 2, 9],
      [2025, 2, 30],
      [2025, 9, 26],
      [2025, 10, 2],
    ] as const) {
      const ms = msUntilNextMidnight(new Date(y, m, d, 0, 0));
      expect(ms).toBeGreaterThanOrEqual(23 * HOUR);
      expect(ms).toBeLessThanOrEqual(25 * HOUR);
    }
  });
});
