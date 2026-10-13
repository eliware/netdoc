import { expect, test } from "@jest/globals";
import { networkPolicyValueFields } from "../src/network-policy-value-fields.mjs";

test("collects addresses from announcements, firewall, NAT, and load balancing", () => {
  expect(
    networkPolicyValueFields({
      l2Announcements: [{ address: "192.0.2.1" }],
      firewall: { rules: [{ source: "192.0.2.0/24", destination: "any" }] },
      nat: { rules: [{ source: "192.0.2.0/24", destination: "any", translation: "masquerade" }] },
      loadBalancing: { listeners: [{ address: "192.0.2.2", targets: [{ address: "192.0.2.3" }] }] },
    }),
  ).toEqual([
    ["/networking/l2Announcements/0/address", "192.0.2.1", false],
    ["/networking/firewall/rules/0/source", "192.0.2.0/24", false],
    ["/networking/firewall/rules/0/destination", "any", false],
    ["/networking/nat/rules/0/source", "192.0.2.0/24", false],
    ["/networking/nat/rules/0/destination", "any", false],
    ["/networking/nat/rules/0/translation", "masquerade", false],
    ["/networking/loadBalancing/listeners/0/address", "192.0.2.2", false],
    ["/networking/loadBalancing/listeners/0/targets/0/address", "192.0.2.3", false],
  ]);
});

test("returns no fields when network policy settings are absent", () => {
  expect(networkPolicyValueFields({})).toEqual([]);
});
