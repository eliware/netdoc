import { reportValidationResult } from "./validation/report.mjs";
import { reportValidationSetupError } from "./validation/setup-result.mjs";
import { runInventoryValidation } from "./validation/run.mjs";

export function validateTarget(
  target,
  {
    write = console.log,
    error = console.error,
    cwd = process.cwd(),
    schemaDirectory,
    fileSystem,
  } = {},
) {
  const result = runInventoryValidation(target, { cwd, schemaDirectory, fileSystem });
  if (result.error !== undefined) return reportValidationSetupError(result, error);
  return reportValidationResult(result.diagnostics, result.fileCount, { write, error });
}
