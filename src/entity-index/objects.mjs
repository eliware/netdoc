export function indexObjectEntity(entitiesById, record, invalid) {
  const id = record.data.id;
  if (typeof id !== "bigint") return;
  entitiesById.set(id, {
    file: record.file,
    pointer: "/id",
    kind: record.data.kind,
    record,
    networkInterface: undefined,
    invalid,
  });
}
