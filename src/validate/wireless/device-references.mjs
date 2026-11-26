import validateWirelessAccessPointReferences from "./access-points/references.mjs";
import validateWirelessControllerReferences from "./controllers/references.mjs";

export default function validateWirelessDeviceReferences(record, entitiesById) {
  return [
    ...validateWirelessAccessPointReferences(record, entitiesById),
    ...validateWirelessControllerReferences(record, entitiesById),
  ];
}
