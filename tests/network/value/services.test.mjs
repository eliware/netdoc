import { expect, test } from "@jest/globals";
import { dhcpScopeFields } from "../../../src/dhcp-scope-fields.mjs";
import { loadBalancerAddressPoolFields } from "../../../src/load-balancer-address-pool-fields.mjs";
import { networkServiceFields } from "../../../src/network/value/services.mjs";

test("collects address pool and DHCP values through their existing collectors", () => {
  const network = {
    loadBalancing: { addressPools: [{ cidr: "192.0.2.0/24" }] },
    dhcp: { scopes: [{ network: "192.0.2.0/24" }] },
  };

  expect(networkServiceFields(network)).toEqual([
    ...loadBalancerAddressPoolFields(network),
    ...dhcpScopeFields(network),
  ]);
});
