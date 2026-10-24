import { createDiagnostic } from "../../../diagnostics.mjs";
import { isMatchingDhcpReservation } from "./dhcp-reservation-matching.mjs";
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
  if (addressAssignment.assignment === "virtual" || networkInterface.segmentId === undefined)
    return [];
  const key = `${networkInterface.segmentId}:${parsed.version}`;
  const range = addressRange(parsed);
  const previous = (assignments.get(key) ?? []).find((item) => rangesOverlap(item.range, range));
  if (
    previous &&
    previous.range.start === range.start &&
    previous.range.end === range.end &&
    range.start === range.end &&
    isMatchingDhcpReservation(previous, networkInterface, addressAssignment)
  )
    return [];
  if (previous)
    return [
      createDiagnostic(
        record.file,
        pointer,
        record.data.id,
        `Address ${cidr} is in use at ${previous.file}#${previous.pointer}.`,
        "Use a unique address on this segment or mark a shared address as virtual.",
      ),
    ];
  const current = assignments.get(key) ?? [];
  current.push({
    file: record.file,
    pointer,
    assignment: addressAssignment.assignment,
    macAddress: networkInterface.macAddress,
    range,
  });
  assignments.set(key, current);
  return [];
}
