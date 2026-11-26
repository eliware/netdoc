import { expect, jest, test } from "@jest/globals";
import validationJson from "../../../src/validation/json/report.mjs";
import reportValidationJson from "../../../src/validation/json/command.mjs";

const result = { exitCode: 1, fileCount: 1, diagnostics: [] };

test("writes serialized JSON and returns its exit code", () => {
  const write = jest.fn();
  expect(reportValidationJson(result, { write })).toBe(1);
  expect(write).toHaveBeenCalledWith(validationJson(result));
});

test("uses the default writer", () => {
  const write = jest.spyOn(console, "log").mockImplementation(() => {});
  try {
    expect(reportValidationJson(result)).toBe(1);
    expect(write).toHaveBeenCalledWith(validationJson(result));
  } finally {
    write.mockRestore();
  }
});
