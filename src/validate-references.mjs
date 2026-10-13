import { validateLocalReferences } from "./validate-local-references.mjs";
import { validateLocalSegmentReferences } from "./validate-local-segment-references.mjs";
import { validateObjectReferences } from "./validate-object-references.mjs";
import { validateConnections } from "./validate-connections.mjs";

export function validateReferences(records, entitiesById) {
  return [
    ...records.flatMap((record) => [
      ...validateLocalReferences(record),
      ...validateLocalSegmentReferences(record, entitiesById),
      ...validateObjectReferences(record, entitiesById),
    ]),
    ...validateConnections(records, entitiesById),
  ];
}
