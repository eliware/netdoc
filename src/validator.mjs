import { tryLoadInventory } from "./inventory-loader.mjs";
import { tryLoadSchemaValidators } from "./schema-validators.mjs";
import { validateIdentifiers } from "./validate-identifiers.mjs";
import { validateReferences } from "./validate-references.mjs";
import { validateNetworks } from "./validate-networks.mjs";
import { validateNetworkValues } from "./network-value-validation.mjs";
import { validateSwitchPorts } from "./validate-switch-ports.mjs";
import { validateRecords } from "./validate-records.mjs";
import { reportValidationResult } from "./validation-report.mjs";
import { reportValidationSetupError } from "./validation-setup-result.mjs";

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
  const diagnostics = [...inventory.diagnostics, ...schemaDiagnostics];
  const { diagnostics: idDiagnostics } = validateIdentifiers(inventory.records);
  diagnostics.push(...idDiagnostics);
  if (diagnostics.length === 0) {
    const { entitiesById: validEntities } = validateIdentifiers(validRecords);
    diagnostics.push(...validateReferences(validRecords, validEntities));
    diagnostics.push(...validateNetworks(validRecords, validEntities));
    diagnostics.push(...validateNetworkValues(validRecords));
    diagnostics.push(...validateSwitchPorts(validRecords, validEntities));
  }
  return reportValidationResult(diagnostics, inventory.fileCount, { write, error });
}
