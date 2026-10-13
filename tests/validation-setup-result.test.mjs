import { expect, jest, test } from "@jest/globals";
import { reportValidationSetupError } from "../src/validation-setup-result.mjs";

test("returns without output when setup succeeds", () => {
  const error = jest.fn();
  expect(reportValidationSetupError({ inventory: {} }, error)).toBeUndefined();
  expect(error).not.toHaveBeenCalled();
});

test("reports setup errors and returns the setup exit code", () => {
  const error = jest.fn();
  expect(reportValidationSetupError({ error: "Cannot load input." }, error)).toBe(2);
  expect(error).toHaveBeenCalledWith("Cannot load input.");
});
