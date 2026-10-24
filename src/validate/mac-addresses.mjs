import { checkMac } from "../network/mac-address-checks.mjs";

export function validateMacAddresses(records, entitiesById) {
  const diagnostics = [];
  const macs = new Map();
  for (const record of records) {
    for (const [index, networkInterface] of (record.data.interfaces ?? []).entries()) {
      const segmentIds = new Set([
        networkInterface.segmentId,
        ...(networkInterface.wireless?.broadcasts ?? []).map(({ segmentId }) => segmentId),
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
