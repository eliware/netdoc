import { validateInterfaceNameReferences } from "../interface/name-references.mjs";
import { validateDuplicateInterfaceNames } from "../duplicate-interface-names.mjs";
import { validateNetworkInterfaceReferences } from "../network/interface-references.mjs";
export function validateLocalReferences(record) {
  return [
    ...validateDuplicateInterfaceNames(record),
    ...validateInterfaceNameReferences(record),
    ...validateNetworkInterfaceReferences(record),
  ];
}
