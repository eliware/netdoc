import { createDiagnostic } from "./diagnostics.mjs";

export function validateLocalObjectReferences(record, entitiesById) {
  const diagnostics = [];
  for (const [index, networkInterface] of (record.data.interfaces ?? []).entries())
    checkSegment(
      networkInterface.segmentId,
      record,
      `/interfaces/${index}/segmentId`,
      entitiesById,
      diagnostics,
    );
  for (const [index, port] of (record.data.switch?.ports ?? []).entries()) {
    const pointer = `/switch/ports/${index}`;
    for (const [field, ids] of [
      ["segmentId", [port.segmentId]],
      ["segmentIds", port.segmentIds ?? []],
      ["pvidSegmentId", [port.pvidSegmentId]],
    ]) {
      ids
        .filter((id) => id !== undefined)
        .forEach((id, idIndex) =>
          checkSegment(
            id,
            record,
            `${pointer}/${field}${field === "segmentIds" ? `/${idIndex}` : ""}`,
            entitiesById,
            diagnostics,
          ),
        );
    }
  }
  for (const [index, entry] of (record.data.networking?.l2Announcements ?? []).entries()) {
    const target = entitiesById.get(entry.nodeId);
    const names = new Set((target?.record.data.interfaces ?? []).map((item) => item.name));
    if (entry.interfaceName !== undefined && !names.has(entry.interfaceName))
      diagnostics.push(
        createDiagnostic(
          record.file,
          `/networking/l2Announcements/${index}/interfaceName`,
          record.data.id,
          `Interface name '${entry.interfaceName}' does not exist on the referenced object.`,
          "Use the name of an interface on the referenced object.",
        ),
      );
  }
  return diagnostics;
}

function checkSegment(id, record, pointer, entitiesById, diagnostics) {
  if (id === undefined) return;
  const target = entitiesById.get(id);
  if (target?.kind !== "network-segment")
    diagnostics.push(
      createDiagnostic(
        record.file,
        pointer,
        record.data.id,
        `Reference ${id} does not resolve to a network-segment.`,
        "Use the ID of an existing network-segment.",
      ),
    );
}
