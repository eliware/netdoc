import { expect, test } from "@jest/globals";
import { networkPolicyFields } from "../../../src/network/value/policy.mjs";
import { networkPolicyValueFields } from "../../../src/network/policy/value-fields.mjs";

test("collects policy values through the existing policy collector", () => {
  const network = {
    firewall: { rules: [{ source: "192.0.2.0/24" }] },
    nat: { rules: [{ source: "192.0.2.1" }] },
    loadBalancing: { listeners: [{ address: "192.0.2.2" }] },
  };

  expect(networkPolicyFields(network)).toEqual(networkPolicyValueFields(network));
});
