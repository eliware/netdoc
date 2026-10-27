import { networkAnnouncementFirewallValueFields } from "../announcement-firewall-value-fields.mjs";
import { networkNatValueFields } from "../nat-value-fields.mjs";

export function networkPolicyValueFields(network) {
  return [...networkAnnouncementFirewallValueFields(network), ...networkNatValueFields(network)];
}
