import { validateInterfaceNameReferences } from "./validate-interface-name-references.mjs";
import { validateSwitchPortReferences } from "./validate-switch-port-references.mjs";
import { validateNetworkInterfaceReferences } from "./validate-network-interface-references.mjs";
export function validateLocalReferences(record) {
  return [
    ...validateInterfaceNameReferences(record),
    ...validateSwitchPortReferences(record),
    ...validateNetworkInterfaceReferences(record),
  ];
}
