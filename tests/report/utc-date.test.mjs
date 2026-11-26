import { expect, test } from "@jest/globals";
import utcDay from "../../src/report/utc-date.mjs";

test("converts a date to its UTC calendar day", () => {
  expect(utcDay(new Date("2026-10-23T01:00:00-04:00"))).toBe(
    Date.parse("2026-10-23T00:00:00.000Z"),
  );
});
