import { validateInterfaceAddressFormat } from "./validate-interface-address-format.mjs";
import { validateInterfaceAddressUniqueness } from "./validate-interface-address-uniqueness.mjs";
import { validateInterfaceAddressSegment } from "./validate-interface-address-segment.mjs";

export function validateInterfaceAddress(
  networkInterface,
  assignment,
  record,
  pointer,
  entitiesById,
  assignments,
) {
  const segmentEntity =
    networkInterface.segmentId === undefined
      ? undefined
      : entitiesById.get(networkInterface.segmentId);
  const segment = segmentEntity?.kind === "network-segment" ? segmentEntity.record.data : undefined;
  const format = validateInterfaceAddressFormat(assignment.cidr, record, pointer);
  if (format.diagnostic) return [format.diagnostic];
  return [
    ...validateInterfaceAddressUniqueness(
      networkInterface,
      assignment,
      format.parsed,
      assignment.cidr,
      record,
      pointer,
      assignments,
    ),
    ...validateInterfaceAddressSegment(assignment.cidr, record, pointer, segment),
  ];
}
