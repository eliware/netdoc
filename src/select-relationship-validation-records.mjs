export function selectRelationshipValidationRecords(records, idDiagnostics) {
  const invalidIds = new Set(
    idDiagnostics
      .map(({ objectId }) => objectId)
      .filter((objectId) => typeof objectId === "bigint"),
  );
  return records.filter((record) => {
    const ids = [record.data.id, ...(record.data.interfaces ?? []).map(({ id }) => id)];
    return !ids.some((id) => invalidIds.has(id));
  });
}
