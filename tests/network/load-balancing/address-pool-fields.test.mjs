import { expect, test } from "@jest/globals";
import { loadBalancerAddressPoolFields } from "../../../src/network/load-balancing/address-pool-fields.mjs";

test("collects load-balancer pool addresses", () => {
  expect(
    loadBalancerAddressPoolFields({ loadBalancing: { addressPools: [{ cidr: "192.0.2.0/24" }] } }),
  ).toEqual([
    ["/networking/loadBalancing/addressPools/0/cidr", "192.0.2.0/24", true],
    ["/networking/loadBalancing/addressPools/0/start", undefined, false, { hostOnly: true }],
    ["/networking/loadBalancing/addressPools/0/end", undefined, false, { hostOnly: true }],
  ]);
  expect(loadBalancerAddressPoolFields({})).toEqual([]);
});
