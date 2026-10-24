import { indexInterfaceEntities } from "./entity-index/interfaces.mjs";
import { indexObjectEntity } from "./entity-index/objects.mjs";

export function indexEntities(records, invalidRecords = []) {
  const entitiesById = new Map();
  for (const [record, invalid] of [
    ...invalidRecords.map((record) => [record, true]),
    ...records.map((record) => [record, false]),
  ]) {
    indexObjectEntity(entitiesById, record, invalid);
    indexInterfaceEntities(entitiesById, record, invalid);
  }
  return entitiesById;
}
