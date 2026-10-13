import { createDiagnostic } from "./diagnostics.mjs";
import { convertBigIntsForValidation } from "./validation-value-conversion.mjs";

export function validateRecords(records, validators) {
  const diagnostics = [];
  const validRecords = [];
  for (const record of records) {
    const validate = validators[record.data.kind];
    if (!validate) {
      diagnostics.push(
        createDiagnostic(
          record.file,
          "",
          record.data.id,
          "Missing or unsupported object kind.",
          "Use one of the supported schema kinds.",
        ),
      );
      continue;
    }
    if (validate(convertBigIntsForValidation(record.data))) {
      validRecords.push(record);
      continue;
    }
    for (const issue of validate.errors) {
      diagnostics.push(
        createDiagnostic(
          record.file,
          issue.instancePath,
          record.data.id,
          issue.message,
          `Correct the value at '${issue.instancePath || "/"}'.`,
        ),
      );
    }
  }
  return { validRecords, diagnostics };
}
