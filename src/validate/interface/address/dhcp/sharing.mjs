import { isMatchingDhcpReservation } from "./reservation-matching.mjs";

export function isAllowedDhcpSharing(previous, networkInterface, addressAssignment, range) {
  return Boolean(
    previous.range.start === range.start &&
    previous.range.end === range.end &&
    range.start === range.end &&
    isMatchingDhcpReservation(previous, networkInterface, addressAssignment),
  );
}
