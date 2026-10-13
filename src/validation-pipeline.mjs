import { validateIdentifiers } from "./validate-identifiers.mjs";
import { indexEntities } from "./index-entities.mjs";
import { validateReferences } from "./validate-references.mjs";
import { validateNetworks } from "./validate-networks.mjs";
import { validateNetworkValues } from "./network-value-validation.mjs";
import { validateSwitchPorts } from "./validate-switch-ports.mjs";
import { selectRelationshipValidationRecords } from "./select-relationship-validation-records.mjs";

export function runValidationPipeline({ inventoryRecords, validRecords, initialDiagnostics }) {
  const diagnostics = [...initialDiagnostics];
  const idDiagnostics = validateIdentifiers(inventoryRecords);
  diagnostics.push(...idDiagnostics);
  const relationshipRecords = selectRelationshipValidationRecords(validRecords, idDiagnostics);
  const relationshipRecordSet = new Set(relationshipRecords);
  const invalidRecords = inventoryRecords.filter((record) => !relationshipRecordSet.has(record));
  const validEntities = indexEntities(relationshipRecords, invalidRecords);
  diagnostics.push(...validateReferences(relationshipRecords, validEntities));
  diagnostics.push(...validateNetworks(relationshipRecords, validEntities));
  diagnostics.push(...validateNetworkValues(validRecords));
  diagnostics.push(...validateSwitchPorts(relationshipRecords, validEntities));
  return diagnostics;
}
