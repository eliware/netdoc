export function indexInterfaceEntities(entitiesById, record, invalid) {
  const interfaces = Array.isArray(record.data.interfaces) ? record.data.interfaces : [];
  interfaces.forEach((networkInterface, index) => {
    if (!networkInterface || typeof networkInterface !== "object") return;
    const id = networkInterface.id;
    if (typeof id !== "bigint") return;
    entitiesById.set(id, {
      file: record.file,
      pointer: `/interfaces/${index}/id`,
      kind: "interface",
      record,
      networkInterface,
      invalid,
    });
  });
}
