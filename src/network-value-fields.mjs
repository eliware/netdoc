import { networkPolicyValueFields } from "./network-policy-value-fields.mjs";
import { networkRouteValueFields } from "./network-route-value-fields.mjs";
import { networkTunnelValueFields } from "./network-tunnel-value-fields.mjs";

export function networkValueFields(data) {
  const network = data.networking ?? {};
  return [
    ...networkRouteValueFields(network),
    ...networkTunnelValueFields(network),
    ...networkPolicyValueFields(network),
  ];
}
