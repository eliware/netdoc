import { expect, test } from "@jest/globals";
import parseUtcDay from "../../src/report/parse-utc-day.mjs";

test("parses valid ISO dates at UTC midnight", () => {
  expect(parseUtcDay("2026-10-23")).toBe(Date.parse("2026-10-23T00:00:00.000Z"));
});

test("rejects invalid date strings and calendar dates", () => {
  expect(parseUtcDay("10/23/2026")).toBeUndefined();
  expect(parseUtcDay("2026-02-30")).toBeUndefined();
});
