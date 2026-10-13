import { checkInterfaceAddresses } from "./network-interface-address-checks.mjs";

export function validateInterfaceAddresses(records, entitiesById) {
  const diagnostics = [];
  const assignments = new Map();
  for (const record of records) {
    for (const [index, networkInterface] of (record.data.interfaces ?? []).entries()) {
      const segment =
        networkInterface.segmentId === undefined
          ? undefined
          : entitiesById.get(networkInterface.segmentId);
      checkInterfaceAddresses(
        networkInterface,
        record,
        `/interfaces/${index}`,
        segment?.kind === "network-segment" ? segment.record.data : undefined,
        assignments,
        diagnostics,
      );
    }
  }
  return diagnostics;
}
