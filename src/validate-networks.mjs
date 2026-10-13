import { checkMac, checkSegmentAddresses } from "./network-address-checks.mjs";
import { checkInterfaceAddresses } from "./network-interface-address-checks.mjs";

export function validateNetworks(records, entitiesById) {
  const diagnostics = [];
  const assignments = new Map();
  const macs = new Map();
  for (const record of records) {
    const segments = new Map();
    for (const [index, networkInterface] of (record.data.interfaces ?? []).entries()) {
      const pointer = `/interfaces/${index}`;
      const segment =
        networkInterface.segmentId === undefined
          ? undefined
          : entitiesById.get(networkInterface.segmentId);
      if (segment?.kind === "network-segment")
        segments.set(networkInterface.name, segment.record.data);
      checkMac(
        networkInterface,
        record,
        pointer,
        segments.get(networkInterface.name),
        macs,
        diagnostics,
      );
      checkInterfaceAddresses(
        networkInterface,
        record,
        pointer,
        segment?.record.data,
        assignments,
        diagnostics,
      );
    }
    checkSegmentAddresses(record, diagnostics);
  }
  return diagnostics;
}
