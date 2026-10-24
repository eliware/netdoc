import { expect, test } from "@jest/globals";
import { formatEvidenceFreshness } from "../../src/report/output.mjs";

test("formats evidence rows and age values", () => {
  expect(
    formatEvidenceFreshness(
      [
        { status: "no-evidence", file: "none.yaml", name: "None" },
        {
          status: "stale",
          file: "old.yaml",
          name: "Old",
          source: "console",
          checkedOn: "2026-01-01",
          ageDays: 295,
        },
      ],
      30,
      new Date("2026-10-23T00:00:00Z"),
    ),
  ).toBe(
    "Evidence freshness as of 2026-10-23 UTC (maximum age: 30 days).\n" +
      "Status | File | Record | Source | Checked on | Age in days\n" +
      "no-evidence | none.yaml | None |  |  | \n" +
      "stale | old.yaml | Old | console | 2026-01-01 | 295",
  );
});

test("uses the current UTC date when the caller omits it", () => {
  expect(formatEvidenceFreshness([], 7)).toMatch(/^Evidence freshness as of \d{4}-\d{2}-\d{2} UTC/);
});
