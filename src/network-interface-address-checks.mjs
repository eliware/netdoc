import { createDiagnostic } from "./diagnostics.mjs";
import { parseAddress } from "./ip-addresses.mjs";
import { prefixInNetwork } from "./network-containment.mjs";

export function checkInterfaceAddresses(
  networkInterface,
  record,
  pointer,
  segment,
  assignments,
  diagnostics,
) {
  for (const [index, assignment] of (networkInterface.addresses ?? []).entries()) {
    const addressPointer = `${pointer}/addresses/${index}/cidr`;
    if (assignment.cidr === undefined) continue;
    const parsed = parseAddress(assignment.cidr);
    if (!parsed) {
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
      const key = `${networkInterface.segmentId}:${parsed.version}:${parsed.integer}`;
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
    const networks = segment?.ipNetworks ?? [];
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
