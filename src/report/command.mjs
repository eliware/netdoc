import { parseFreshnessArguments } from "./arguments.mjs";
import { collectEvidenceFreshness } from "./evidence.mjs";
import { formatEvidenceFreshness } from "./format.mjs";
import { runInventoryValidation } from "../validation/run.mjs";
import { reportValidationErrors } from "../validation/report.mjs";
import { reportValidationSetupError } from "../validation/setup-result.mjs";

export function reportInventoryFreshness(args, options = {}) {
  const parsed = parseFreshnessArguments(args);
  const error = options.error ?? console.error;
  if (parsed.error !== undefined) {
    error(parsed.error);
    return 2;
  }
  const result = runInventoryValidation(parsed.path, options);
  if (result.error !== undefined) return reportValidationSetupError(result, error);
  if (result.diagnostics.length > 0)
    return reportValidationErrors(result.diagnostics, result.fileCount, error);
  const now = options.now ?? new Date();
  const rows = collectEvidenceFreshness(result.records, parsed.maxAgeDays, now);
  (options.write ?? console.log)(formatEvidenceFreshness(rows, parsed.maxAgeDays, now));
  return 0;
}
