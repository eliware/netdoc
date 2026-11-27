import normalizeMacAddress from "../../../../network/address/mac-normalization.mjs";

export default function isMatchingDhcpReservation(previous, networkInterface, addressAssignment) {
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
