import { expect, test } from "@jest/globals";
import { networkPolicyValueFields } from "../../../src/network/policy/value-fields.mjs";

test("combines announcement, firewall, and NAT fields in order", () => {
  const fields = networkPolicyValueFields({
    l2Announcements: [{ address: "192.0.2.1" }],
    firewall: { rules: [{ source: "192.0.2.0/24", destination: "any" }] },
    nat: { rules: [{ source: "192.0.2.0/24", destination: "any", translation: "masquerade" }] },
  });
  expect(fields.map(([pointer]) => pointer)).toEqual([
    "/networking/l2Announcements/0/address",
    "/networking/firewall/rules/0/source",
    "/networking/firewall/rules/0/destination",
    "/networking/nat/rules/0/source",
    "/networking/nat/rules/0/destination",
    "/networking/nat/rules/0/translation",
  ]);
});

test("returns no fields when network policy settings are absent", () => {
  expect(networkPolicyValueFields({})).toEqual([]);
});
