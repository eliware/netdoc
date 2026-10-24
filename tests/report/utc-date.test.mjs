import { expect, test } from "@jest/globals";
import { parseUtcDay, utcDay } from "../../src/report/utc-date.mjs";

test("parses valid ISO dates at UTC midnight", () => {
  expect(parseUtcDay("2026-10-23")).toBe(Date.parse("2026-10-23T00:00:00.000Z"));
});

test("rejects invalid date strings and calendar dates", () => {
  expect(parseUtcDay("10/23/2026")).toBeUndefined();
  expect(parseUtcDay("2026-02-30")).toBeUndefined();
});

test("converts a date to its UTC calendar day", () => {
  expect(utcDay(new Date("2026-10-23T01:00:00-04:00"))).toBe(
    Date.parse("2026-10-23T00:00:00.000Z"),
  );
});
