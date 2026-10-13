import { validateNetworkSegmentReference } from "./validate-network-segment-reference.mjs";

export function validateInterfaceSegmentReferences(record, entitiesById) {
  return (record.data.interfaces ?? []).flatMap((networkInterface, index) =>
    validateNetworkSegmentReference(
      networkInterface.segmentId,
      record,
      `/interfaces/${index}/segmentId`,
      entitiesById,
    ),
  );
}
