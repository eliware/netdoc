import { formatDiagnostic } from "../diagnostics.mjs";

export function reportValidationResult(diagnostics, fileCount, { write, error }) {
  if (diagnostics.length > 0) {
    return reportValidationErrors(diagnostics, fileCount, error);
  }
  write(`Validated ${fileCount} YAML file(s).`);
  return 0;
}

export function reportValidationErrors(diagnostics, fileCount, error) {
  diagnostics.forEach((diagnostic) => error(formatDiagnostic(diagnostic)));
  error(`Found ${diagnostics.length} error(s) in ${fileCount} YAML file(s).`);
  return 1;
}
