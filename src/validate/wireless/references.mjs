import { validateWirelessDeviceReferences } from "./device-references.mjs";
import { validateWirelessRoleReferences } from "./role-references.mjs";
import { validateWirelessNetworkReferences } from "./network-references.mjs";
import { validateWirelessSegmentReferences } from "./segments.mjs";
import { validateWirelessReferenceUniqueness } from "./unique-references.mjs";

export function validateWirelessReferences(record, entitiesById) {
  return [
    ...validateWirelessNetworkReferences(record, entitiesById),
    ...validateWirelessDeviceReferences(record, entitiesById),
    ...validateWirelessRoleReferences(record, entitiesById),
    ...validateWirelessSegmentReferences(record, entitiesById),
    ...validateWirelessReferenceUniqueness(record),
  ];
}
