import { createDiagnostic } from "./diagnostics.mjs";
import { addressInNetwork } from "./network-containment.mjs";
import { parseAddress } from "./ip-addresses.mjs";

export function checkSegmentAddresses(record, diagnostics) {
  if (record.data.kind !== "network-segment") return;
  for (const [index, network] of (record.data.ipNetworks ?? []).entries()) {
    if (!parseAddress(network.cidr))
      diagnostics.push(
        createDiagnostic(
          record.file,
          `/ipNetworks/${index}/cidr`,
          record.data.id,
          `Invalid network prefix '${network.cidr}'.`,
          "Use a valid IP network with a prefix length.",
        ),
      );
    if (network.gateway && !addressInNetwork(network.gateway, network.cidr))
      diagnostics.push(
        createDiagnostic(
          record.file,
          `/ipNetworks/${index}/gateway`,
          record.data.id,
          `Gateway ${network.gateway} is outside network ${network.cidr}.`,
          "Use a gateway address inside this network.",
        ),
      );
  }
}
