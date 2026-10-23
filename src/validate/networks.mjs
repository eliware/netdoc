import { validateInterfaceAddresses } from "./interface/addresses.mjs";
import { validateMacAddresses } from "./mac-addresses.mjs";
import { validateSegmentAddresses } from "./segment/addresses.mjs";
import { validateDnsNameDuplicates } from "./interface/dns-name-duplicates.mjs";

export function validateNetworks(records, entitiesById) {
  return [
    ...validateInterfaceAddresses(records, entitiesById),
    ...validateMacAddresses(records, entitiesById),
    ...validateSegmentAddresses(records),
    ...records.flatMap((record) => validateDnsNameDuplicates(record)),
  ];
}
