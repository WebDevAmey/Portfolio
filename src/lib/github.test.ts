import { describe, expect, it } from "vitest";

import { parseContributions } from "./github";

const day = (date: string, id: string, level: number) =>
  `<td tabindex="0" data-ix="0" style="width: 10px" data-date="${date}" id="${id}" data-level="${level}" role="gridcell" class="ContributionCalendar-day"></td>`;
const tip = (id: string, text: string) =>
  `<tool-tip id="t-${id}" for="${id}" popover="manual" class="sr-only">${text}</tool-tip>`;

const html = [
  `<h2 id="js-contribution-activity-description">\n  1,204\n  contributions\n    in the last year\n</h2>`,
  ...["a", "b", "c", "d", "e", "f", "g"].map((id, i) => day(`2026-01-0${7 - i}`, id, i % 5)),
  tip("a", "No contributions on January 7th."),
  tip("b", "1 contribution on January 6th."),
  tip("c", "1,024 contributions on January 5th."),
].join("\n");

describe("parseContributions", () => {
  it("reads days oldest first with levels and counts", () => {
    const result = parseContributions(html);
    expect(result?.days).toHaveLength(7);
    expect(result?.days[0].date).toBe("2026-01-01");
    expect(result?.days.at(-1)).toEqual({ date: "2026-01-07", level: 0, count: 0 });
    expect(result?.days.find((d) => d.date === "2026-01-06")).toEqual({
      date: "2026-01-06",
      level: 1,
      count: 1,
    });
    expect(result?.days.find((d) => d.date === "2026-01-05")?.count).toBe(1024);
  });

  it("reads the yearly total from the heading", () => {
    expect(parseContributions(html)?.total).toBe(1204);
  });

  it("returns null for markup without a calendar", () => {
    expect(parseContributions("<html><body>rate limited</body></html>")).toBeNull();
  });
});
