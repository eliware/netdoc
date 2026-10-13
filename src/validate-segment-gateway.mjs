import { createDiagnostic } from "./diagnostics.mjs";
import { addressInNetwork } from "./network-containment.mjs";

export function validateSegmentGateway(record, network, index) {
  if (!network.gateway || addressInNetwork(network.gateway, network.cidr)) return [];
  return [
    createDiagnostic(
      record.file,
      `/ipNetworks/${index}/gateway`,
      record.data.id,
      `Gateway ${network.gateway} is outside network ${network.cidr}.`,
      "Use a gateway address inside this network.",
    ),
  ];
}
