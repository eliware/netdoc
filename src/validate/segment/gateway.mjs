import { createDiagnostic } from "../../diagnostics.mjs";
import { addressInNetwork } from "../../network/address/membership.mjs";
import { addressRange } from "../../network/address/ranges.mjs";
import { parseAddress } from "../../ip-addresses.mjs";

export function validateSegmentGateway(record, network, index) {
  if (network.gateway === undefined || isUsableGateway(network.gateway, network.cidr)) return [];
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

function isUsableGateway(gateway, cidr) {
  if (gateway.includes("/") || !addressInNetwork(gateway, cidr)) return false;
  const parsedGateway = parseAddress(gateway);
  const parsedNetwork = parseAddress(cidr);
  const { start, end } = addressRange(parsedNetwork);
  const pointToPoint =
    (parsedNetwork.version === 4 && parsedNetwork.prefix === 31) ||
    (parsedNetwork.version === 6 && parsedNetwork.prefix === 127);
  const isNetworkAddress =
    !pointToPoint && parsedNetwork.prefix < parsedNetwork.bits && parsedGateway.integer === start;
  const isIpv4Broadcast =
    parsedNetwork.version === 4 && parsedNetwork.prefix < 31 && parsedGateway.integer === end;
  return !isNetworkAddress && !isIpv4Broadcast;
}
