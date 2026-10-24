import { validateNetworkSegmentReference } from "../network/segment-reference.mjs";

export function validateWirelessSegmentReferences(record, entitiesById) {
  const checks = [];
  (record.data.interfaces ?? []).forEach((networkInterface, interfaceIndex) => {
    (networkInterface.wireless?.broadcasts ?? []).forEach((broadcast, broadcastIndex) => {
      checks.push([
        broadcast.segmentId,
        `/interfaces/${interfaceIndex}/wireless/broadcasts/${broadcastIndex}/segmentId`,
      ]);
    });
  });
  return checks.flatMap(([id, pointer]) =>
    validateNetworkSegmentReference(id, record, pointer, entitiesById),
  );
}
