import { afterEach, expect, jest, test } from "@jest/globals";
import { generateIds } from "../src/snowflake.mjs";

afterEach(() => jest.restoreAllMocks());

test("prints one generated ID by default", () => {
  const write = jest.fn();
  expect(generateIds([], { generateId: () => "100", write })).toBe(0);
  expect(write).toHaveBeenCalledWith("100\n");
});

test("uses the package generator when no generator is supplied", () => {
  const write = jest.fn();
  expect(generateIds([], { write })).toBe(0);
  expect(write).toHaveBeenCalledWith(expect.stringMatching(/^\d+\n$/u));
});

test("prints the requested number of IDs", () => {
  let id = 100;
  const write = jest.fn();
  expect(generateIds(["-n", "3"], { generateId: () => id++, write })).toBe(0);
  expect(write.mock.calls).toEqual([["100\n"], ["101\n"], ["102\n"]]);
});

test.each([
  ["--count", "2"],
  ["-n", "0"],
  ["-n", "1", "extra"],
])("rejects invalid options %s %s", (...args) => {
  const error = jest.fn();
  expect(generateIds(args, { error })).toBe(2);
  expect(error).toHaveBeenCalledWith("Usage: netdoc --generate-id [-n COUNT]");
});

test("uses the default error writer for invalid options", () => {
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(generateIds(["bad"])).toBe(2);
  expect(error).toHaveBeenCalledWith("Usage: netdoc --generate-id [-n COUNT]");
});

test("rejects a count that exceeds the safe integer range", () => {
  const error = jest.fn();
  expect(generateIds(["-n", "999999999999999999999"], { error })).toBe(2);
  expect(error).toHaveBeenCalledWith("COUNT must be a positive safe integer.");
});
