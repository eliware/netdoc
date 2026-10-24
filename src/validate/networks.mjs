import { validateInterfaceAddresses } from "./interface/addresses.mjs";
import { validateMacAddresses } from "./mac-addresses.mjs";
import { validateSegmentAddresses } from "./segment/addresses.mjs";
import { validateDnsNameDuplicatesAcrossRecords } from "./interface/dns-name/collection.mjs";

export function validateNetworks(records, entitiesById) {
  return [
    ...validateInterfaceAddresses(records, entitiesById),
    ...validateMacAddresses(records, entitiesById),
    ...validateSegmentAddresses(records),
    ...validateDnsNameDuplicatesAcrossRecords(records),
  ];
}
