import { validateWirelessBroadcastUniqueness } from "./broadcast-uniqueness.mjs";
import { validateWirelessProfileUniqueness } from "./profile-uniqueness.mjs";

export function validateWirelessReferenceUniqueness(record) {
  return [
    ...validateWirelessProfileUniqueness(record),
    ...validateWirelessBroadcastUniqueness(record),
  ];
}
