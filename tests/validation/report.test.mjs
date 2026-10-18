import { expect, jest, test } from "@jest/globals";
import { createDiagnostic } from "../../src/diagnostics.mjs";
import { reportValidationResult } from "../../src/validation/report.mjs";

test("reports validation success", () => {
  const write = jest.fn();
  const error = jest.fn();
  expect(reportValidationResult([], 2, { write, error })).toBe(0);
  expect(write).toHaveBeenCalledWith("Validated 2 YAML file(s).");
  expect(error).not.toHaveBeenCalled();
});

test("reports diagnostics and the error summary", () => {
  const write = jest.fn();
  const error = jest.fn();
  const diagnostic = createDiagnostic("node.yaml", "/name", 5n, "Name is missing", "Add a name");
  expect(reportValidationResult([diagnostic], 1, { write, error })).toBe(1);
  expect(error).toHaveBeenNthCalledWith(
    1,
    "ERROR node.yaml#/name [id=5]: Name is missing. Suggestion: Add a name",
  );
  expect(error).toHaveBeenNthCalledWith(2, "Found 1 error(s) in 1 YAML file(s).");
  expect(write).not.toHaveBeenCalled();
});
