import { expect, test } from "@jest/globals";
import { networkLoadBalancerValueFields } from "../../src/network/load-balancer-value-fields.mjs";
import { validateNetworkAddressFields } from "../../src/validate/network/address/fields.mjs";

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

test("reports invalid listener addresses", () => {
  expect(
    validateNetworkAddressFields(
      networkLoadBalancerValueFields({ loadBalancing: { listeners: [{ address: "bad" }] } }),
      { file: "router.yaml", data: { id: 1n } },
    ).map(({ pointer }) => pointer),
  ).toEqual(["/networking/loadBalancing/listeners/0/address"]);
});
