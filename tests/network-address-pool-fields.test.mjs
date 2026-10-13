import { expect, test } from "@jest/globals";
import { networkAddressPoolFields } from "../src/network-address-pool-fields.mjs";

test("orders load-balancer fields before DHCP fields", () => {
  expect(
    networkAddressPoolFields({
      loadBalancing: { addressPools: [{}] },
      dhcp: { scopes: [{}] },
    }).map(([pointer]) => pointer),
  ).toEqual([
    "/networking/loadBalancing/addressPools/0/cidr",
    "/networking/loadBalancing/addressPools/0/start",
    "/networking/loadBalancing/addressPools/0/end",
    "/networking/dhcp/scopes/0/network",
    "/networking/dhcp/scopes/0/rangeStart",
    "/networking/dhcp/scopes/0/rangeEnd",
    "/networking/dhcp/scopes/0/gateway",
  ]);
});

test("returns no fields when the record has no address pools", () => {
  expect(networkAddressPoolFields({})).toEqual([]);
});
