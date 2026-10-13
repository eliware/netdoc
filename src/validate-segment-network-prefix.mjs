import { createDiagnostic } from "./diagnostics.mjs";
import { parseAddress } from "./ip-addresses.mjs";

export function validateSegmentNetworkPrefix(record, network, index) {
  if (parseAddress(network.cidr) && network.cidr.includes("/")) return [];
  return [
    createDiagnostic(
      record.file,
      `/ipNetworks/${index}/cidr`,
      record.data.id,
      `Invalid network prefix '${network.cidr}'.`,
      "Use a valid IP network with a prefix length.",
    ),
  ];
}
