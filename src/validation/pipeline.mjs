import validateIdentifiers from "../validate/identifiers.mjs";
import validateNetworkValues from "../network/value/records.mjs";
import validateApplications from "../validate/applications.mjs";
import validateRelationships from "./relationships.mjs";

export default function runValidationPipeline({
  inventoryRecords,
  validRecords,
  initialDiagnostics,
}) {
  const diagnostics = [...initialDiagnostics];
  const idDiagnostics = validateIdentifiers(inventoryRecords);
  diagnostics.push(...idDiagnostics);
  diagnostics.push(...validateRelationships({ inventoryRecords, validRecords, idDiagnostics }));
  diagnostics.push(...validRecords.flatMap(validateApplications));
  diagnostics.push(...validateNetworkValues(validRecords));
  return diagnostics;
}
