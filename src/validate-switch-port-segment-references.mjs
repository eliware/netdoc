import { validateNetworkSegmentReference } from "./validate-network-segment-reference.mjs";

export function validateSwitchPortSegmentReferences(record, entitiesById) {
  return (record.data.switch?.ports ?? []).flatMap((port, index) => {
    const pointer = `/switch/ports/${index}`;
    const references = [
      ["segmentId", [port.segmentId]],
      ["segmentIds", port.segmentIds ?? []],
      ["pvidSegmentId", [port.pvidSegmentId]],
    ];
    return references.flatMap(([field, ids]) =>
      ids.flatMap((id, idIndex) =>
        validateNetworkSegmentReference(
          id,
          record,
          `${pointer}/${field}${field === "segmentIds" ? `/${idIndex}` : ""}`,
          entitiesById,
        ),
      ),
    );
  });
}
