import { validateAccessSwitchPorts } from "../access-switch-ports.mjs";
import { validateTrunkSwitchPorts } from "../trunk-switch-ports.mjs";
import { validateSwitchPortReferences } from "./port/references.mjs";
import { validateSwitchPortSegmentReferences } from "./port/segment/references.mjs";

export function validateSwitchPorts(records, entitiesById) {
  return [
    ...records.flatMap((record) => validateSwitchPortReferences(record)),
    ...records.flatMap((record) => validateSwitchPortSegmentReferences(record, entitiesById)),
    ...validateAccessSwitchPorts(records),
    ...validateTrunkSwitchPorts(records, entitiesById),
  ];
}
