import { dhcpScopeFields } from "../../dhcp-scope-fields.mjs";
import { loadBalancerAddressPoolFields } from "../../load-balancer-address-pool-fields.mjs";

export function networkServiceFields(network) {
  return [...loadBalancerAddressPoolFields(network), ...dhcpScopeFields(network)];
}
