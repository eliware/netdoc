import { createDiagnostic } from "./diagnostics.mjs";
import { normalizeMacAddress } from "./normalize-mac-address.mjs";

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
        `Address ${cidr} is already assigned at ${previous.file}#${previous.pointer}.`,
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

function addressRange(parsed) {
  const hostBits = BigInt(parsed.bits - parsed.prefix);
  const start = (parsed.integer >> hostBits) << hostBits;
  if (parsed.integer !== start) return { start: parsed.integer, end: parsed.integer };
  return { start, end: start + (1n << hostBits) - 1n };
}

function rangesOverlap(first, second) {
  return first.start <= second.end && second.start <= first.end;
}

function isMatchingDhcpReservation(previous, networkInterface, addressAssignment) {
  const sameDhcpAddress =
    (previous.assignment === "dhcp" && addressAssignment.assignment === "dhcp-reservation") ||
    (previous.assignment === "dhcp-reservation" && addressAssignment.assignment === "dhcp");
  return Boolean(
    sameDhcpAddress &&
    previous.macAddress &&
    networkInterface.macAddress &&
    normalizeMacAddress(previous.macAddress) === normalizeMacAddress(networkInterface.macAddress),
  );
}
