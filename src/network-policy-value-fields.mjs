import { networkAnnouncementFirewallValueFields } from "./network-announcement-firewall-value-fields.mjs";
import { networkLoadBalancerValueFields } from "./network-load-balancer-value-fields.mjs";
import { networkNatValueFields } from "./network-nat-value-fields.mjs";

export function networkPolicyValueFields(network) {
  return [
    ...networkAnnouncementFirewallValueFields(network),
    ...networkNatValueFields(network),
    ...networkLoadBalancerValueFields(network),
  ];
}
