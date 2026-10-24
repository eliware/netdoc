import { expect, test } from "@jest/globals";
import { collectReviewFreshness } from "../../src/report/review-dates.mjs";

test("classifies missing, current, stale, future, and invalid review dates by UTC day", () => {
  const records = [
    { file: "missing.yaml", data: { name: "Missing" } },
    { file: "current.yaml", data: { name: "Current", lastReviewed: "2026-10-23" } },
    { file: "stale.yaml", data: { name: "Stale", lastReviewed: "2026-10-01" } },
    { file: "future.yaml", data: { name: "Future", lastReviewed: "2026-10-24" } },
    { file: "invalid.yaml", data: { name: "Invalid", lastReviewed: "2026-02-30" } },
  ];

  expect(collectReviewFreshness(records, 7, new Date("2026-10-23T01:00:00-04:00"))).toEqual([
    { status: "missing", file: "missing.yaml", name: "Missing", lastReviewed: undefined },
    {
      status: "current",
      file: "current.yaml",
      name: "Current",
      lastReviewed: "2026-10-23",
      ageDays: 0,
    },
    {
      status: "stale",
      file: "stale.yaml",
      name: "Stale",
      lastReviewed: "2026-10-01",
      ageDays: 22,
    },
    {
      status: "future",
      file: "future.yaml",
      name: "Future",
      lastReviewed: "2026-10-24",
      ageDays: -1,
    },
    {
      status: "invalid-date",
      file: "invalid.yaml",
      name: "Invalid",
      lastReviewed: "2026-02-30",
    },
  ]);
});

test("uses the current date when the caller omits it", () => {
  expect(collectReviewFreshness([], 30)).toEqual([]);
});
