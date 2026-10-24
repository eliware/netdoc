import { expect, test } from "@jest/globals";
import { parseGraphArguments } from "../../src/graph/arguments.mjs";

test("parses Mermaid graph arguments", () => {
  expect(parseGraphArguments(["inventory", "--format", "mermaid"])).toEqual({
    path: "inventory",
    format: "mermaid",
  });
});

test("rejects other graph formats and argument shapes", () => {
  expect(parseGraphArguments(["inventory", "--format", "json"]).error).toContain("Usage:");
  expect(parseGraphArguments([]).error).toContain("Usage:");
});
