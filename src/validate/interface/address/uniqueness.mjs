import createDiagnostic from "../../../diagnostics.mjs";
import isAllowedDhcpSharing from "./dhcp/sharing.mjs";
import isAllowedVirtualSharing from "./virtual-sharing.mjs";
import addressRange from "../../../network/address/ranges.mjs";
import rangesOverlap from "../../../network/address/ranges-overlap.mjs";

export default function validateInterfaceAddressUniqueness(
  networkInterface,
  addressAssignment,
  parsed,
  cidr,
  record,
  pointer,
  assignments,
) {
  const segmentIds = new Set(
    [
      networkInterface.segmentId,
      ...(networkInterface.wireless?.broadcasts ?? []).map(({ segmentId }) => segmentId),
    ].filter((id) => id !== undefined),
  );
  if (segmentIds.size === 0) return [];
  const range = addressRange(parsed);
  const diagnostics = [];
  const currentAssignment = {
    file: record.file,
    pointer,
    assignment: addressAssignment.assignment,
    macAddress: networkInterface.macAddress,
    range,
  };
  for (const segmentId of segmentIds) {
    // Separate segments may have the same IP address.
    const key = `${segmentId}:${parsed.version}`;
    const current = assignments.get(key) ?? [];
    const overlaps = current.filter((item) => rangesOverlap(item.range, range));
    const previous = overlaps.find(
      (item) =>
        !isAllowedVirtualSharing(item, addressAssignment, range) &&
        !isAllowedDhcpSharing(item, networkInterface, addressAssignment, range),
    );
    if (previous) {
      diagnostics.push(
        createDiagnostic(
          record.file,
          pointer,
          record.data.id,
          `Address ${cidr} is in use at ${previous.file}#${previous.pointer}.`,
          "Use a unique address on this segment or mark a shared address as virtual.",
        ),
      );
      continue;
    }
    current.push(currentAssignment);
    assignments.set(key, current);
  }
  return diagnostics;
}
