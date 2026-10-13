import { tryLoadInventory } from "./inventory-loader.mjs";
import { tryLoadSchemaValidators } from "./schema-validators.mjs";
import { validateRecords } from "./validate-records.mjs";
import { reportValidationResult } from "./validation-report.mjs";
import { reportValidationSetupError } from "./validation-setup-result.mjs";
import { runValidationPipeline } from "./validation-pipeline.mjs";

export function validateTarget(
  target,
  { write = console.log, error = console.error, cwd = process.cwd(), schemaDirectory } = {},
) {
  const inventoryResult = tryLoadInventory(target, { cwd });
  const inventoryError = reportValidationSetupError(inventoryResult, error);
  if (inventoryError !== undefined) return inventoryError;
  const { inventory } = inventoryResult;
  const schemaResult = tryLoadSchemaValidators(schemaDirectory);
  const schemaError = reportValidationSetupError(schemaResult, error);
  if (schemaError !== undefined) return schemaError;
  const { validators } = schemaResult;
  const { validRecords, diagnostics: schemaDiagnostics } = validateRecords(
    inventory.records,
    validators,
  );
  const diagnostics = runValidationPipeline({
    inventoryRecords: inventory.records,
    validRecords,
    initialDiagnostics: [...inventory.diagnostics, ...schemaDiagnostics],
  });
  return reportValidationResult(diagnostics, inventory.fileCount, { write, error });
}
