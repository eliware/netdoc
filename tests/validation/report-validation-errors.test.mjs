import { expect, jest, test } from "@jest/globals";
import createDiagnostic from "../../src/diagnostics.mjs";
import reportValidationErrors from "../../src/validation/report-validation-errors.mjs";

test("prints each validation error and an error count", () => {
  const error = jest.fn();
  const diagnostic = createDiagnostic("node.yaml", "/name", 5n, "Name is missing", "Add a name");
  expect(reportValidationErrors([diagnostic], 1, error)).toBe(1);
  expect(error).toHaveBeenNthCalledWith(
    1,
    "ERROR node.yaml#/name [id=5]: Name is missing. Suggestion: Add a name",
  );
  expect(error).toHaveBeenNthCalledWith(2, "Found 1 error(s) in 1 YAML file(s).");
});
