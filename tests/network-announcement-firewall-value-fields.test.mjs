import { expect, test } from "@jest/globals";
import { networkAnnouncementFirewallValueFields } from "../src/network-announcement-firewall-value-fields.mjs";

test("collects announcement and firewall address fields", () => {
  expect(
    networkAnnouncementFirewallValueFields({
      l2Announcements: [{ address: "192.0.2.1" }],
      firewall: { rules: [{ source: "192.0.2.0/24", destination: "any" }] },
    }),
  ).toEqual([
    ["/networking/l2Announcements/0/address", "192.0.2.1", false],
    ["/networking/firewall/rules/0/source", "192.0.2.0/24", false, { allowAny: true }],
    ["/networking/firewall/rules/0/destination", "any", false, { allowAny: true }],
  ]);
  expect(networkAnnouncementFirewallValueFields({})).toEqual([]);
});
