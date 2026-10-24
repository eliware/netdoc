export function createGraphContext(records) {
  const objectNodeByRecord = new Map();
  const objectNodeById = new Map();
  const recordById = new Map();
  const interfaceById = new Map();
  records.forEach((record, recordIndex) => {
    const objectNodeId = `object_${recordIndex}`;
    objectNodeByRecord.set(record, objectNodeId);
    if (typeof record.data.id === "bigint") {
      objectNodeById.set(record.data.id, objectNodeId);
      recordById.set(record.data.id, record);
    }
    (record.data.interfaces ?? []).forEach((networkInterface, interfaceIndex) => {
      if (typeof networkInterface.id !== "bigint") return;
      interfaceById.set(networkInterface.id, {
        nodeId: `interface_${recordIndex}_${interfaceIndex}`,
        record,
        networkInterface,
      });
    });
  });
  return {
    records,
    objectNodeByRecord,
    objectNodeById,
    recordById,
    interfaceById,
    connectionKeys: new Set(),
  };
}
