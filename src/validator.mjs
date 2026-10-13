import { tryLoadInventory } from "./inventory-loader.mjs";
import { tryLoadSchemaValidators } from "./schema-validators.mjs";
import { validateIdentifiers } from "./validate-identifiers.mjs";
import { indexEntities } from "./index-entities.mjs";
import { validateReferences } from "./validate-references.mjs";
import { validateNetworks } from "./validate-networks.mjs";
import { validateNetworkValues } from "./network-value-validation.mjs";
import { validateSwitchPorts } from "./validate-switch-ports.mjs";
import { validateRecords } from "./validate-records.mjs";
import { reportValidationResult } from "./validation-report.mjs";
import { reportValidationSetupError } from "./validation-setup-result.mjs";
import { selectRelationshipValidationRecords } from "./select-relationship-validation-records.mjs";

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
  const idDiagnostics = validateIdentifiers(inventory.records);
  diagnostics.push(...idDiagnostics);
  const relationshipRecords = selectRelationshipValidationRecords(validRecords, idDiagnostics);
  const validEntities = indexEntities(relationshipRecords);
  diagnostics.push(...validateReferences(relationshipRecords, validEntities));
  diagnostics.push(...validateNetworks(relationshipRecords, validEntities));
  diagnostics.push(...validateNetworkValues(validRecords));
  diagnostics.push(...validateSwitchPorts(relationshipRecords, validEntities));
  return reportValidationResult(diagnostics, inventory.fileCount, { write, error });
}
