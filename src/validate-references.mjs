import { validateLocalReferences } from "./validate-local-references.mjs";
import { validateInterfaceSegmentReferences } from "./validate-interface-segment-references.mjs";
import { validateObjectReferences } from "./validate-object-references.mjs";
import { validateConnections } from "./validate-connections.mjs";

export function validateReferences(records, entitiesById) {
  return [
    ...records.flatMap((record) => [
      ...validateLocalReferences(record),
      ...validateInterfaceSegmentReferences(record, entitiesById),
      ...validateObjectReferences(record, entitiesById),
    ]),
    ...validateConnections(records, entitiesById),
  ];
}
