import { expect, test } from "@jest/globals";
import { networkLoadBalancerValueFields } from "../src/network-load-balancer-value-fields.mjs";

test("collects listener and target addresses", () => {
  expect(
    networkLoadBalancerValueFields({
      loadBalancing: { listeners: [{ address: "192.0.2.1", targets: [{ address: "192.0.2.2" }] }] },
    }),
  ).toEqual([
    ["/networking/loadBalancing/listeners/0/address", "192.0.2.1", false, { hostOnly: true }],
    [
      "/networking/loadBalancing/listeners/0/targets/0/address",
      "192.0.2.2",
      false,
      { hostOnly: true },
    ],
  ]);
  expect(networkLoadBalancerValueFields({})).toEqual([]);
});
