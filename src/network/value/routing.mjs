import { networkRouteValueFields } from "../route/value-fields.mjs";
import { networkVrrpValueFields } from "../vrrp-value-fields.mjs";

export function networkRoutingFields(network) {
  return [...networkRouteValueFields(network), ...networkVrrpValueFields(network)];
}
