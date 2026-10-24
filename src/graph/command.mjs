import { parseGraphArguments } from "./arguments.mjs";
import { renderMermaidGraph } from "./mermaid.mjs";
import { runInventoryValidation } from "../validation/run.mjs";
import { reportValidationErrors } from "../validation/report.mjs";
import { reportValidationSetupError } from "../validation/setup-result.mjs";

export function graphInventory(args, options = {}) {
  const parsed = parseGraphArguments(args);
  const error = options.error ?? console.error;
  if (parsed.error !== undefined) {
    error(parsed.error);
    return 2;
  }
  const result = runInventoryValidation(parsed.path, options);
  if (result.error !== undefined) return reportValidationSetupError(result, error);
  if (result.diagnostics.length > 0)
    return reportValidationErrors(result.diagnostics, result.fileCount, error);
  (options.write ?? console.log)(renderMermaidGraph(result.records));
  return 0;
}
