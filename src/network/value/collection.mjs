import { networkAddressPoolFields } from "../address/pool-fields.mjs";
import { networkPolicyValueFields } from "../policy/value-fields.mjs";
import { networkRouteValueFields } from "../route/value-fields.mjs";
import { networkTunnelValueFields } from "../tunnel/value-fields.mjs";
import { networkVrrpValueFields } from "../vrrp-value-fields.mjs";

export function collectNetworkValueFields(data) {
  const network = data.networking ?? {};
  return [
    ...networkRouteValueFields(network),
    ...networkVrrpValueFields(network),
    ...networkTunnelValueFields(network),
    ...networkPolicyValueFields(network),
    ...networkAddressPoolFields(network),
  ];
}
