import { expect, jest, test } from "@jest/globals";
import { validateInventoryArguments } from "../../src/validate/arguments.mjs";

test("accepts one validation path", () => {
  const error = jest.fn();
  expect(validateInventoryArguments(["inventory"], error)).toBeUndefined();
  expect(error).not.toHaveBeenCalled();
});

test("reports when the command has no single path", () => {
  const error = jest.fn();
  expect(validateInventoryArguments([], error)).toBe(2);
  expect(validateInventoryArguments(["one", "two"], error)).toBe(2);
  expect(error).toHaveBeenCalledTimes(2);
  expect(error).toHaveBeenCalledWith("Usage: netdoc validate <yaml-file-or-directory>");
});

test("uses the default error output", () => {
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(validateInventoryArguments([])).toBe(2);
  expect(error).toHaveBeenCalledWith("Usage: netdoc validate <yaml-file-or-directory>");
  error.mockRestore();
});
