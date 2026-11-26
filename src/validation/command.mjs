import validateInventoryArguments from "../validate/arguments.mjs";
import runInventoryValidation from "./run.mjs";
import reportValidationResult from "./report.mjs";
import reportValidationSetupError from "./setup-result.mjs";
import reportValidationJson from "./json/command.mjs";
import reportValidationArgumentError from "./argument-error.mjs";

export default function validateInventory(args, options = {}) {
  const argumentResult = validateInventoryArguments(args);
  if (argumentResult.error !== undefined)
    return reportValidationArgumentError(argumentResult, options);
  const result = runInventoryValidation(argumentResult.path, options);
  if (argumentResult.format === "json") return reportValidationJson(result, options);
  const output = { write: options.write ?? console.log, error: options.error ?? console.error };
  if (result.error !== undefined) return reportValidationSetupError(result, output.error);
  return reportValidationResult(result.diagnostics, result.fileCount, output);
}
