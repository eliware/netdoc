import validateWirelessReferenceChecks from "./reference-checks.mjs";
import validateWirelessUniqueness from "./uniqueness.mjs";

export default function validateWirelessReferences(record, entitiesById) {
  return [
    ...validateWirelessReferenceChecks(record, entitiesById),
    ...validateWirelessUniqueness(record),
  ];
}
