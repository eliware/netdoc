import formatDiagnostic from "../diagnostics/format.mjs";

export default function reportValidationErrors(diagnostics, fileCount, error) {
  diagnostics.forEach((diagnostic) => error(formatDiagnostic(diagnostic)));
  error(`Found ${diagnostics.length} error(s) in ${fileCount} YAML file(s).`);
  return 1;
}
