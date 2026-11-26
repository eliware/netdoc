import validateNetworkSegmentReference from "../network/segment-reference.mjs";

export default function validateInterfaceSegmentReferences(record, entitiesById) {
  return (record.data.interfaces ?? []).flatMap((networkInterface, index) =>
    validateNetworkSegmentReference(
      networkInterface.segmentId,
      record,
      `/interfaces/${index}/segmentId`,
      entitiesById,
    ),
  );
}
