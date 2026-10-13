import { formatDiagnostic } from "./diagnostics.mjs";

export function reportValidationResult(diagnostics, fileCount, { write, error }) {
  if (diagnostics.length > 0) {
    diagnostics.forEach((diagnostic) => error(formatDiagnostic(diagnostic)));
    error(`Found ${diagnostics.length} error(s) in ${fileCount} YAML file(s).`);
    return 1;
  }
  write(`Validated ${fileCount} YAML file(s).`);
  return 0;
}
