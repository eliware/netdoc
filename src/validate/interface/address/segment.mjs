import { createDiagnostic } from "../../../diagnostics.mjs";
import { prefixInNetwork } from "../../../network/containment.mjs";

export function validateInterfaceAddressSegment(cidr, record, pointer, segment) {
  const networks = segment?.ipNetworks ?? [];
  if (networks.length === 0 || networks.some(({ cidr: network }) => prefixInNetwork(cidr, network)))
    return [];
  return [
    createDiagnostic(
      record.file,
      pointer,
      record.data.id,
      `Address ${cidr} is outside the networks listed for its segment.`,
      "Use an address inside a network listed on the referenced segment.",
    ),
  ];
}
