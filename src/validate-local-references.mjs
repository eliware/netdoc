import { validateInterfaceNameReferences } from "./validate-interface-name-references.mjs";
import { validateDuplicateInterfaceNames } from "./validate-duplicate-interface-names.mjs";
import { validateSwitchPortReferences } from "./validate-switch-port-references.mjs";
import { validateNetworkInterfaceReferences } from "./validate-network-interface-references.mjs";
export function validateLocalReferences(record) {
  return [
    ...validateDuplicateInterfaceNames(record),
    ...validateInterfaceNameReferences(record),
    ...validateSwitchPortReferences(record),
    ...validateNetworkInterfaceReferences(record),
  ];
}
