import { createDiagnostic } from "./diagnostics.mjs";
import { parseAddress, prefixInNetwork } from "./ip-addresses.mjs";
import { checkMac, checkSegmentAddresses } from "./network-address-checks.mjs";

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
      for (const [addressIndex, assignment] of (networkInterface.addresses ?? []).entries()) {
        const addressPointer = `${pointer}/addresses/${addressIndex}/cidr`;
        if (assignment.cidr === undefined) continue;
        if (!parseAddress(assignment.cidr)) {
          diagnostics.push(
            createDiagnostic(
              record.file,
              addressPointer,
              record.data.id,
              `Invalid IP address or prefix '${assignment.cidr}'.`,
              "Use a valid IP address with an optional prefix length.",
            ),
          );
          continue;
        }
        if (assignment.assignment !== "virtual" && networkInterface.segmentId !== undefined) {
          const key = `${networkInterface.segmentId}:${parseAddress(assignment.cidr).version}:${parseAddress(assignment.cidr).integer}`;
          const previous = assignments.get(key);
          if (previous)
            diagnostics.push(
              createDiagnostic(
                record.file,
                addressPointer,
                record.data.id,
                `Address ${assignment.cidr} is already assigned at ${previous.file}#${previous.pointer}.`,
                "Use a unique address on this segment or mark a shared address as virtual.",
              ),
            );
          else assignments.set(key, { file: record.file, pointer: addressPointer });
        }
        const networks = segment?.record.data.ipNetworks ?? [];
        if (
          networks.length > 0 &&
          !networks.some(({ cidr }) => prefixInNetwork(assignment.cidr, cidr))
        ) {
          diagnostics.push(
            createDiagnostic(
              record.file,
              addressPointer,
              record.data.id,
              `Address ${assignment.cidr} is outside the networks listed for its segment.`,
              "Use an address inside a network listed on the referenced segment.",
            ),
          );
        }
      }
    }
    checkSegmentAddresses(record, diagnostics);
  }
  return diagnostics;
}
