import { validateInterfaceAddressFormat } from "./validate-interface-address-format.mjs";
import { validateInterfaceAddressUniqueness } from "./validate-interface-address-uniqueness.mjs";
import { validateInterfaceAddressSegment } from "./validate-interface-address-segment.mjs";

export function checkInterfaceAddresses(
  networkInterface,
  record,
  pointer,
  segment,
  assignments,
  diagnostics,
) {
  for (const [index, assignment] of (networkInterface.addresses ?? []).entries()) {
    const addressPointer = `${pointer}/addresses/${index}/cidr`;
    if (assignment.cidr === undefined) continue;
    const format = validateInterfaceAddressFormat(assignment.cidr, record, addressPointer);
    if (format.diagnostic) {
      diagnostics.push(format.diagnostic);
      continue;
    }
    diagnostics.push(
      ...validateInterfaceAddressUniqueness(
        networkInterface,
        assignment,
        format.parsed,
        assignment.cidr,
        record,
        addressPointer,
        assignments,
      ),
      ...validateInterfaceAddressSegment(assignment.cidr, record, addressPointer, segment),
    );
  }
}
