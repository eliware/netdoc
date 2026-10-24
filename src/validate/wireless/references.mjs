import { validateWirelessDeviceReferences } from "./device-references.mjs";
import { validateWirelessAccessPointRoles } from "./access-points.mjs";
import { validateWirelessControllerRoles } from "./controllers.mjs";
import { validateWirelessNetworkReferences } from "./network-references.mjs";
import { validateWirelessSegmentReferences } from "./segments.mjs";
import { validateWirelessReferenceUniqueness } from "./unique-references.mjs";

export function validateWirelessReferences(record, entitiesById) {
  return [
    ...validateWirelessNetworkReferences(record, entitiesById),
    ...validateWirelessDeviceReferences(record, entitiesById),
    ...validateWirelessAccessPointRoles(record, entitiesById),
    ...validateWirelessControllerRoles(record, entitiesById),
    ...validateWirelessSegmentReferences(record, entitiesById),
    ...validateWirelessReferenceUniqueness(record),
  ];
}
