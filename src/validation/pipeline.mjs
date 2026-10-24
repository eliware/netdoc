import { validateIdentifiers } from "../validate/identifiers.mjs";
import { validateNetworkValues } from "../network/value/records.mjs";
import { validateRelationships } from "./relationships.mjs";

export function runValidationPipeline({ inventoryRecords, validRecords, initialDiagnostics }) {
  const diagnostics = [...initialDiagnostics];
  const idDiagnostics = validateIdentifiers(inventoryRecords);
  diagnostics.push(...idDiagnostics);
  diagnostics.push(...validateRelationships({ inventoryRecords, validRecords, idDiagnostics }));
  diagnostics.push(...validateNetworkValues(validRecords));
  return diagnostics;
}
