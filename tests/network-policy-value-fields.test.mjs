import { expect, test } from "@jest/globals";
import { networkPolicyValueFields } from "../src/network-policy-value-fields.mjs";

test("combines announcement, firewall, NAT, and load balancer fields in order", () => {
  const fields = networkPolicyValueFields({
    l2Announcements: [{ address: "192.0.2.1" }],
    firewall: { rules: [{ source: "192.0.2.0/24", destination: "any" }] },
    nat: { rules: [{ source: "192.0.2.0/24", destination: "any", translation: "masquerade" }] },
    loadBalancing: { listeners: [{ address: "192.0.2.2", targets: [{ address: "192.0.2.3" }] }] },
  });
  expect(fields.map(([pointer]) => pointer)).toEqual([
    "/networking/l2Announcements/0/address",
    "/networking/firewall/rules/0/source",
    "/networking/firewall/rules/0/destination",
    "/networking/nat/rules/0/source",
    "/networking/nat/rules/0/destination",
    "/networking/nat/rules/0/translation",
    "/networking/loadBalancing/listeners/0/address",
    "/networking/loadBalancing/listeners/0/targets/0/address",
  ]);
});

test("returns no fields when network policy settings are absent", () => {
  expect(networkPolicyValueFields({})).toEqual([]);
});
