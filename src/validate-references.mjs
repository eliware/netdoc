import { validateLocalReferences } from "./validate-local-references.mjs";
import { validateLocalObjectReferences } from "./validate-local-object-references.mjs";
import { validateObjectReferences } from "./validate-object-references.mjs";
import { validateConnections } from "./validate-connections.mjs";

export function validateReferences(records, entitiesById) {
  return [
    ...records.flatMap((record) => [
      ...validateLocalReferences(record),
      ...validateLocalObjectReferences(record, entitiesById),
      ...validateObjectReferences(record, entitiesById),
    ]),
    ...validateConnections(records, entitiesById),
  ];
}
