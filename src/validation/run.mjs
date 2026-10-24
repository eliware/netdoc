import { tryLoadInventory } from "../inventory-loader.mjs";
import { tryLoadSchemaValidators } from "../schema/load-result.mjs";
import { validateRecords } from "../validate/records.mjs";
import { runValidationPipeline } from "./pipeline.mjs";

export function runInventoryValidation(target, options = {}) {
  const inventoryResult = tryLoadInventory(target, options);
  if (inventoryResult.error !== undefined) return setupError(inventoryResult.error);
  const { inventory } = inventoryResult;
  const schemaResult = tryLoadSchemaValidators(options.schemaDirectory);
  if (schemaResult.error !== undefined) return setupError(schemaResult.error);
  const { validRecords, diagnostics: schemaDiagnostics } = validateRecords(
    inventory.records,
    schemaResult.validators,
  );
  const diagnostics = runValidationPipeline({
    inventoryRecords: inventory.records,
    validRecords,
    initialDiagnostics: [...inventory.diagnostics, ...schemaDiagnostics],
  });
  return {
    exitCode: diagnostics.length > 0 ? 1 : 0,
    diagnostics,
    fileCount: inventory.fileCount,
    records: validRecords,
  };
}

function setupError(error) {
  return {
    exitCode: 2,
    error,
    errorCode: "NETDOC_SETUP_ERROR",
    diagnostics: [],
    fileCount: 0,
    records: [],
  };
}
