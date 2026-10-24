import { createDiagnostic } from "../../../diagnostics.mjs";
import { isAllowedDhcpSharing } from "./dhcp/sharing.mjs";
import { addressRange, rangesOverlap } from "../../../network/address/ranges.mjs";

export function validateInterfaceAddressUniqueness(
  networkInterface,
  addressAssignment,
  parsed,
  cidr,
  record,
  pointer,
  assignments,
) {
  if (addressAssignment.assignment === "virtual") return [];
  const segmentIds = new Set(
    [
      networkInterface.segmentId,
      ...(networkInterface.wireless?.broadcasts ?? []).map(({ segmentId }) => segmentId),
    ].filter((id) => id !== undefined),
  );
  if (segmentIds.size === 0) return [];
  const range = addressRange(parsed);
  const diagnostics = [];
  for (const segmentId of segmentIds) {
    const key = `${segmentId}:${parsed.version}`;
    const current = assignments.get(key) ?? [];
    const overlaps = current.filter((item) => rangesOverlap(item.range, range));
    const previous = overlaps.find(
      (item) => !isAllowedDhcpSharing(item, networkInterface, addressAssignment, range),
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
    if (overlaps.length > 0) continue;
    current.push({
      file: record.file,
      pointer,
      assignment: addressAssignment.assignment,
      macAddress: networkInterface.macAddress,
      range,
    });
    assignments.set(key, current);
  }
  return diagnostics;
}
