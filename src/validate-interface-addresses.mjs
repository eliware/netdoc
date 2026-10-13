import { validateInterfaceAddressFormat } from "./validate-interface-address-format.mjs";
import { validateInterfaceAddressUniqueness } from "./validate-interface-address-uniqueness.mjs";
import { validateInterfaceAddressSegment } from "./validate-interface-address-segment.mjs";

export function validateInterfaceAddresses(records, entitiesById) {
  const diagnostics = [];
  const assignments = new Map();
  for (const record of records) {
    for (const [index, networkInterface] of (record.data.interfaces ?? []).entries()) {
      const segment =
        networkInterface.segmentId === undefined
          ? undefined
          : entitiesById.get(networkInterface.segmentId);
      for (const [addressIndex, assignment] of (networkInterface.addresses ?? []).entries()) {
        if (assignment.cidr === undefined) continue;
        const pointer = `/interfaces/${index}/addresses/${addressIndex}/cidr`;
        const format = validateInterfaceAddressFormat(assignment.cidr, record, pointer);
        if (format.diagnostic) {
          diagnostics.push(format.diagnostic);
          continue;
        }
        diagnostics.push(
          ...validateInterfaceAddressUniqueness(
            networkInterface,
            assignment,
            format.parsed,
            assignment.cidr,
            record,
            pointer,
            assignments,
          ),
          ...validateInterfaceAddressSegment(
            assignment.cidr,
            record,
            pointer,
            segment?.kind === "network-segment" ? segment.record.data : undefined,
          ),
        );
      }
    }
  }
  return diagnostics;
}
