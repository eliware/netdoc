import { networkPolicyFields } from "./policy.mjs";
import { networkRoutingFields } from "./routing.mjs";
import { networkServiceFields } from "./services.mjs";
import { networkTunnelFields } from "./tunnel.mjs";

export function collectNetworkValueFields(data) {
  const network = data.networking ?? {};
  return [
    ...networkRoutingFields(network),
    ...networkTunnelFields(network),
    ...networkPolicyFields(network),
    ...networkServiceFields(network),
  ];
}
