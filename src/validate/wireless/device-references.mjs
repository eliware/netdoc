import { validateWirelessAccessPointReferences } from "./access-points.mjs";
import { validateWirelessControllerReferences } from "./controllers.mjs";

export function validateWirelessDeviceReferences(record, entitiesById) {
  return [
    ...validateWirelessAccessPointReferences(record, entitiesById),
    ...validateWirelessControllerReferences(record, entitiesById),
  ];
}
