import { createDiagnostic } from "../../diagnostics.mjs";
import { validNetworkAddressValue } from "../network/address/value.mjs";

export function validateSegmentNetworkPrefix(record, network, index) {
  if (validNetworkAddressValue(network.cidr, true, `/ipNetworks/${index}/cidr`)) return [];
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
