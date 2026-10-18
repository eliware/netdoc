import { validateLocalReferences } from "./local/references.mjs";
import { validateInterfaceSegmentReferences } from "./interface/segment-references.mjs";
import { validateObjectReferences } from "./object-references.mjs";
import { validateConnections } from "./connections.mjs";

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
