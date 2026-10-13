import { checkMac } from "./network-mac-address-checks.mjs";

export function validateMacAddresses(records, entitiesById) {
  const diagnostics = [];
  const macs = new Map();
  for (const record of records) {
    for (const [index, networkInterface] of (record.data.interfaces ?? []).entries()) {
      const segment =
        networkInterface.segmentId === undefined
          ? undefined
          : entitiesById.get(networkInterface.segmentId);
      checkMac(
        networkInterface,
        record,
        `/interfaces/${index}`,
        segment?.kind === "network-segment" ? segment.record.data : undefined,
        macs,
        diagnostics,
      );
    }
  }
  return diagnostics;
}
