import { createDiagnostic } from "../../diagnostics.mjs";
import { addressInNetwork } from "../../network/address/membership.mjs";

export function validateSegmentGateway(record, network, index) {
  if (network.gateway === undefined || addressInNetwork(network.gateway, network.cidr)) return [];
  return [
    createDiagnostic(
      record.file,
      `/ipNetworks/${index}/gateway`,
      record.data.id,
      `Gateway ${network.gateway} is invalid or outside network ${network.cidr}.`,
      "Use a gateway address inside this network.",
    ),
  ];
}
