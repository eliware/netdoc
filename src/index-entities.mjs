export function indexEntities(records, invalidRecords = []) {
  const entitiesById = new Map();
  for (const [record, invalid] of [
    ...invalidRecords.map((record) => [record, true]),
    ...records.map((record) => [record, false]),
  ]) {
    addEntity(entitiesById, record.data.id, {
      file: record.file,
      pointer: "/id",
      kind: record.data.kind,
      record,
      networkInterface: undefined,
      invalid,
    });
    const interfaces = Array.isArray(record.data.interfaces) ? record.data.interfaces : [];
    interfaces.forEach((networkInterface, index) => {
      if (!networkInterface || typeof networkInterface !== "object") return;
      addEntity(entitiesById, networkInterface.id, {
        file: record.file,
        pointer: `/interfaces/${index}/id`,
        kind: "interface",
        record,
        networkInterface,
        invalid,
      });
    });
  }
  return entitiesById;
}

function addEntity(entitiesById, id, entity) {
  if (typeof id === "bigint") entitiesById.set(id, entity);
}
