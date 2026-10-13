import { validateInterfaceSegmentReferences } from "./validate-interface-segment-references.mjs";
import { validateSwitchPortSegmentReferences } from "./validate-switch-port-segment-references.mjs";

export function validateLocalSegmentReferences(record, entitiesById) {
  return [
    ...validateInterfaceSegmentReferences(record, entitiesById),
    ...validateSwitchPortSegmentReferences(record, entitiesById),
  ];
}
