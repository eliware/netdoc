import { validateInventoryArguments } from "../validate/arguments.mjs";
import { runInventoryValidation } from "./run.mjs";
import { reportValidationResult } from "./report.mjs";
import { reportValidationSetupError } from "./setup-result.mjs";
import { validationJson } from "./json-report.mjs";
import { reportValidationArgumentError } from "./argument-error.mjs";

export function validateInventory(args, options = {}) {
  const argumentResult = validateInventoryArguments(args);
  if (argumentResult.error !== undefined)
    return reportValidationArgumentError(argumentResult, options);
  const result = runInventoryValidation(argumentResult.path, options);
  if (argumentResult.format === "json") {
    (options.write ?? console.log)(validationJson(result));
    return result.exitCode;
  }
  const output = { write: options.write ?? console.log, error: options.error ?? console.error };
  if (result.error !== undefined) return reportValidationSetupError(result, output.error);
  return reportValidationResult(result.diagnostics, result.fileCount, output);
}
