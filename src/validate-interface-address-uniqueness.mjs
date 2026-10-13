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
  const key = `${networkInterface.segmentId}:${parsed.version}:${parsed.integer}`;
  const previous = assignments.get(key);
  if (previous && isMatchingDhcpReservation(previous, networkInterface, addressAssignment))
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
  assignments.set(key, {
    file: record.file,
    pointer,
    assignment: addressAssignment.assignment,
    macAddress: networkInterface.macAddress,
  });
  return [];
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
