import validateWirelessDeviceReferences from "./device-references.mjs";
import validateWirelessAccessPointRoles from "./access-points/roles.mjs";
import validateWirelessControllerRoles from "./controllers/roles.mjs";
import validateWirelessNetworkReferences from "./network-references.mjs";
import validateWirelessSegmentReferences from "./segments.mjs";
import validateWirelessUniqueness from "./uniqueness.mjs";

export default function validateWirelessReferences(record, entitiesById) {
  return [
    ...validateWirelessNetworkReferences(record, entitiesById),
    ...validateWirelessDeviceReferences(record, entitiesById),
    ...validateWirelessAccessPointRoles(record, entitiesById),
    ...validateWirelessControllerRoles(record, entitiesById),
    ...validateWirelessSegmentReferences(record, entitiesById),
    ...validateWirelessUniqueness(record),
  ];
}
