import { checkSegmentAddresses } from "./network-segment-address-checks.mjs";

export function validateSegmentAddresses(records) {
  const diagnostics = [];
  for (const record of records) checkSegmentAddresses(record, diagnostics);
  return diagnostics;
}
