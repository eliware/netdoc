import { indexEntities } from "../index-entities.mjs";
import { validateNetworks } from "../validate/networks.mjs";
import { validateReferences } from "../validate/references.mjs";
import { validateSwitchPorts } from "../validate/switch/ports.mjs";
import { selectRelationshipValidationRecords } from "../select-relationship-validation-records.mjs";

export function validateRelationships({ inventoryRecords, validRecords, idDiagnostics }) {
  const relationshipRecords = selectRelationshipValidationRecords(validRecords, idDiagnostics);
  const relationshipRecordSet = new Set(relationshipRecords);
  const invalidRecords = inventoryRecords.filter((record) => !relationshipRecordSet.has(record));
  const entitiesById = indexEntities(relationshipRecords, invalidRecords);
  return [
    ...validateReferences(relationshipRecords, entitiesById),
    ...validateNetworks(relationshipRecords, entitiesById),
    ...validateSwitchPorts(relationshipRecords, entitiesById),
  ];
}
