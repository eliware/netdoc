import { afterEach, expect, jest, test } from "@jest/globals";
import { generateIds } from "../src/snowflake.mjs";

afterEach(() => jest.restoreAllMocks());

test("prints one generated ID by default", () => {
  const write = jest.fn();
  expect(generateIds([], { generateId: () => "100", write })).toBe(0);
  expect(write).toHaveBeenCalledWith("100");
});

test("uses the package generator when no generator is supplied", () => {
  const write = jest.spyOn(console, "log").mockImplementation(() => {});
  expect(generateIds([])).toBe(0);
  expect(write).toHaveBeenCalledWith(expect.stringMatching(/^\d+$/u));
});

test("prints the requested number of IDs", () => {
  let id = 100;
  const write = jest.fn();
  expect(generateIds(["-n", "3"], { generateId: () => id++, write })).toBe(0);
  expect(write.mock.calls).toEqual([["100"], ["101"], ["102"]]);
});

test("reports invalid options", () => {
  const error = jest.fn();
  expect(generateIds(["bad"], { error })).toBe(2);
  expect(error).toHaveBeenCalledWith("Usage: netdoc --generate-id [-n COUNT]");
});
