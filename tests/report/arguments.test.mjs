import { expect, test } from "@jest/globals";
import { parseFreshnessArguments } from "../../src/report/arguments.mjs";

test("parses the freshness report command", () => {
  expect(parseFreshnessArguments(["inventory", "--freshness", "--max-age-days", "30"])).toEqual({
    path: "inventory",
    maxAgeDays: 30,
  });
});

test.each(["0", "-1", "1.5", "9007199254740992", "days"])(
  "rejects invalid maximum age %s",
  (value) => {
    expect(
      parseFreshnessArguments(["inventory", "--freshness", "--max-age-days", value]).error,
    ).toMatch("Usage:");
  },
);
