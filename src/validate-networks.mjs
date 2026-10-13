import { validateInterfaceAddresses } from "./validate-interface-addresses.mjs";
import { validateMacAddresses } from "./validate-mac-addresses.mjs";
import { validateSegmentAddresses } from "./validate-segment-addresses.mjs";

export function validateNetworks(records, entitiesById) {
  return [
    ...validateInterfaceAddresses(records, entitiesById),
    ...validateMacAddresses(records, entitiesById),
    ...validateSegmentAddresses(records),
  ];
}
