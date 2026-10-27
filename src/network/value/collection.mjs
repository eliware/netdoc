import { networkPolicyFields } from "./policy.mjs";
import { networkRoutingFields } from "./routing.mjs";
import { networkTunnelFields } from "./tunnel.mjs";
import { dhcpScopeFields } from "../dhcp/value-fields.mjs";
import { loadBalancerAddressPoolFields } from "../load-balancing/address-pool-fields.mjs";
import { networkLoadBalancerValueFields } from "../load-balancing/value-fields.mjs";

export function collectNetworkValueFields(data) {
  const network = data.networking ?? {};
  return [
    ...networkRoutingFields(network),
    ...networkTunnelFields(network),
    ...networkPolicyFields(network),
    ...networkLoadBalancerValueFields(network),
    ...loadBalancerAddressPoolFields(network),
    ...dhcpScopeFields(network),
  ];
}
