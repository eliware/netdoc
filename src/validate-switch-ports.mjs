import { validateAccessSwitchPorts } from "./validate-access-switch-ports.mjs";
import { validateTrunkSwitchPorts } from "./validate-trunk-switch-ports.mjs";
import { validateSwitchPortReferences } from "./validate-switch-port-references.mjs";
import { validateSwitchPortSegmentReferences } from "./validate-switch-port-segment-references.mjs";

export function validateSwitchPorts(records, entitiesById) {
  return [
    ...records.flatMap((record) => validateSwitchPortReferences(record)),
    ...records.flatMap((record) => validateSwitchPortSegmentReferences(record, entitiesById)),
    ...validateAccessSwitchPorts(records),
    ...validateTrunkSwitchPorts(records, entitiesById),
  ];
}
