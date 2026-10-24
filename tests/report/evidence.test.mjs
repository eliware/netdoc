import { expect, test } from "@jest/globals";
import { collectEvidenceFreshness } from "../../src/report/evidence.mjs";

test("categorizes missing, undated, current, stale, and future evidence by UTC day", () => {
  const records = [
    { file: "none.yaml", data: { name: "None" } },
    {
      file: "evidence.yaml",
      data: {
        name: "Evidence",
        evidence: [
          { source: "undated" },
          { source: "today", checkedOn: "2026-10-23" },
          { source: "old", checkedOn: "2026-10-01" },
          { source: "future", checkedOn: "2026-10-24" },
        ],
      },
    },
  ];
  expect(collectEvidenceFreshness(records, 7, new Date("2026-10-23T01:00:00-04:00"))).toEqual([
    { status: "no-evidence", file: "none.yaml", name: "None" },
    { status: "undated", file: "evidence.yaml", name: "Evidence", source: "undated" },
    {
      status: "current",
      file: "evidence.yaml",
      name: "Evidence",
      source: "today",
      checkedOn: "2026-10-23",
      ageDays: 0,
    },
    {
      status: "stale",
      file: "evidence.yaml",
      name: "Evidence",
      source: "old",
      checkedOn: "2026-10-01",
      ageDays: 22,
    },
    {
      status: "future",
      file: "evidence.yaml",
      name: "Evidence",
      source: "future",
      checkedOn: "2026-10-24",
      ageDays: -1,
    },
  ]);
});

test("marks invalid date values for direct callers", () => {
  const rows = collectEvidenceFreshness(
    [
      {
        file: "bad.yaml",
        data: {
          name: "Bad",
          evidence: [
            { checkedOn: "not-a-date" },
            { checkedOn: "2026-02-30" },
            { checkedOn: "2026-99-99" },
          ],
        },
      },
    ],
    1,
    new Date("2026-10-23T00:00:00Z"),
  );
  expect(rows.map(({ status }) => status)).toEqual([
    "invalid-date",
    "invalid-date",
    "invalid-date",
  ]);
});

test("uses the current date when the caller omits it", () => {
  expect(collectEvidenceFreshness([], 30)).toEqual([]);
});
