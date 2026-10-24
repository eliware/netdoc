import { validateWirelessAccessPointReferences } from "./access-points/references.mjs";
import { validateWirelessControllerReferences } from "./controllers/references.mjs";

export function validateWirelessDeviceReferences(record, entitiesById) {
  return [
    ...validateWirelessAccessPointReferences(record, entitiesById),
    ...validateWirelessControllerReferences(record, entitiesById),
  ];
}
