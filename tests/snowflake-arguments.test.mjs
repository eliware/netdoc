import { expect, test } from "@jest/globals";
import { parseSnowflakeArguments } from "../src/snowflake-arguments.mjs";

test("uses one ID when the command has no options", () => {
  expect(parseSnowflakeArguments([])).toEqual({ count: 1 });
});

test("parses a positive count", () => {
  expect(parseSnowflakeArguments(["-n", "3"])).toEqual({ count: 3 });
});

test.each([
  ["--count", "2"],
  ["-n", "0"],
  ["-n", "1", "extra"],
])("rejects invalid options %s %s", (...args) => {
  expect(parseSnowflakeArguments(args)).toEqual({
    error: "Usage: netdoc --generate-id [-n COUNT]",
  });
});

test("limits counts to one thousand IDs", () => {
  expect(parseSnowflakeArguments(["-n", "1000"])).toEqual({ count: 1000 });
  expect(parseSnowflakeArguments(["-n", "1001"])).toEqual({
    error: "COUNT must be an integer from 1 through 1000.",
  });
  expect(parseSnowflakeArguments(["-n", "999999999999999999999"])).toEqual({
    error: "COUNT must be an integer from 1 through 1000.",
  });
});
