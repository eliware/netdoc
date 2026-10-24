import { expect, jest, test } from "@jest/globals";
import { reportValidationArgumentError } from "../../src/validation/argument-error.mjs";

test("reports invalid JSON-mode arguments as one JSON document", () => {
  const write = jest.fn();
  expect(
    reportValidationArgumentError({ error: "Invalid arguments", format: "json" }, { write }),
  ).toBe(2);
  expect(JSON.parse(write.mock.calls[0][0])).toEqual({
    status: "error",
    error: { code: "NETDOC_ARGUMENTS_INVALID", message: "Invalid arguments" },
    summary: { files: 0, errors: 0 },
    diagnostics: [],
  });
});

test("reports invalid text-mode arguments to the error output", () => {
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(reportValidationArgumentError({ error: "Invalid arguments" })).toBe(2);
  expect(error).toHaveBeenCalledWith("Invalid arguments");
  error.mockRestore();
});
