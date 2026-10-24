import { expect, test } from "@jest/globals";
import { validateInventoryArguments } from "../../src/validate/arguments.mjs";

test("accepts one path with the default text format", () => {
  expect(validateInventoryArguments(["inventory"])).toEqual({ path: "inventory", format: "text" });
});

test("accepts a path with text or JSON output", () => {
  expect(validateInventoryArguments(["inventory", "--format", "text"])).toEqual({
    path: "inventory",
    format: "text",
  });
  expect(validateInventoryArguments(["inventory", "--format", "json"])).toEqual({
    path: "inventory",
    format: "json",
  });
});

test("rejects missing paths and invalid output options", () => {
  expect(validateInventoryArguments([])).toMatchObject({
    error: expect.stringContaining("Usage:"),
  });
  expect(validateInventoryArguments(["one", "two"])).toMatchObject({
    error: expect.stringContaining("Usage:"),
  });
  expect(validateInventoryArguments(["inventory", "--format", "xml"])).toMatchObject({
    error: expect.stringContaining("Usage:"),
  });
});
