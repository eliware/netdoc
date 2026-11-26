import reportValidationErrors from "./report-validation-errors.mjs";

export default function reportValidationResult(diagnostics, fileCount, { write, error }) {
  if (diagnostics.length > 0) {
    return reportValidationErrors(diagnostics, fileCount, error);
  }
  write(`Validated ${fileCount} YAML file(s).`);
  return 0;
}
