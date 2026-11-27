import checkMac from "../network/mac-address-checks.mjs";
import wirelessProfileSegmentIds from "./wireless/profile/segment-ids.mjs";

export default function validateMacAddresses(records, entitiesById) {
  const diagnostics = [];
  const macs = new Map();
  for (const record of records) {
    for (const [index, networkInterface] of (record.data.interfaces ?? []).entries()) {
      const segmentIds = new Set([
        networkInterface.segmentId,
        ...(networkInterface.wireless?.broadcasts ?? []).map(({ segmentId }) => segmentId),
        ...wirelessProfileSegmentIds(networkInterface, entitiesById),
      ]);
      for (const segmentId of segmentIds) {
        const segment = entitiesById.get(segmentId);
        checkMac(
          networkInterface,
          record,
          `/interfaces/${index}`,
          segment,
          macs,
          diagnostics,
          segmentId,
        );
      }
    }
  }
  return diagnostics;
}
