import { validateWirelessBroadcastUniqueness } from "./broadcast-uniqueness.mjs";
import { validateWirelessProfileUniqueness } from "./profile-uniqueness.mjs";

export function validateWirelessUniqueness(record) {
  return [
    ...validateWirelessProfileUniqueness(record),
    ...validateWirelessBroadcastUniqueness(record),
  ];
}
