import { expect, test } from "@jest/globals";
import { formatReviewFreshness } from "../../src/report/format.mjs";

test("formats review rows and age values", () => {
  expect(
    formatReviewFreshness(
      [
        { status: "missing", file: "none.yaml", name: "None" },
        {
          status: "stale",
          file: "old.yaml",
          name: "Old",
          lastReviewed: "2026-01-01",
          ageDays: 295,
        },
      ],
      30,
      new Date("2026-10-23T00:00:00Z"),
    ),
  ).toBe(
    "Review freshness as of 2026-10-23 UTC (maximum age: 30 days).\n" +
      "Status | File | Record | Last reviewed | Age in days\n" +
      "missing | none.yaml | None |  | \n" +
      "stale | old.yaml | Old | 2026-01-01 | 295",
  );
});

test("uses the current UTC date when the caller omits it", () => {
  expect(formatReviewFreshness([], 7)).toMatch(/^Review freshness as of \d{4}-\d{2}-\d{2} UTC/);
});
