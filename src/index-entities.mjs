export function indexEntities(records) {
  const entitiesById = new Map();
  for (const record of records) {
    addEntity(entitiesById, record.data.id, {
      file: record.file,
      pointer: "/id",
      kind: record.data.kind,
      record,
      networkInterface: undefined,
    });
    (record.data.interfaces ?? []).forEach((networkInterface, index) =>
      addEntity(entitiesById, networkInterface.id, {
        file: record.file,
        pointer: `/interfaces/${index}/id`,
        kind: "interface",
        record,
        networkInterface,
      }),
    );
  }
  return entitiesById;
}

function addEntity(entitiesById, id, entity) {
  if (typeof id === "bigint") entitiesById.set(id, entity);
}
