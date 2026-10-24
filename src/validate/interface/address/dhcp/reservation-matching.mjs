import { normalizeMacAddress } from "../../../../normalize-mac-address.mjs";

export function isMatchingDhcpReservation(previous, networkInterface, addressAssignment) {
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
