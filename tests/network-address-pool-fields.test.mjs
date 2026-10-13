import { expect, test } from "@jest/globals";
import { networkAddressPoolFields } from "../src/network-address-pool-fields.mjs";

test("collects load-balancer and DHCP address pool fields", () => {
  expect(
    networkAddressPoolFields({
      loadBalancing: {
        addressPools: [{ cidr: "192.0.2.0/24" }, { start: "192.0.2.1", end: "192.0.2.8" }],
      },
      dhcp: {
        scopes: [
          {
            network: "192.0.2.0/24",
            rangeStart: "192.0.2.10",
            rangeEnd: "192.0.2.20",
            gateway: "192.0.2.1",
            reservations: [{ address: "192.0.2.11" }],
          },
        ],
      },
    }),
  ).toEqual([
    ["/networking/loadBalancing/addressPools/0/cidr", "192.0.2.0/24", true],
    ["/networking/loadBalancing/addressPools/0/start", undefined, false],
    ["/networking/loadBalancing/addressPools/0/end", undefined, false],
    ["/networking/loadBalancing/addressPools/1/cidr", undefined, true],
    ["/networking/loadBalancing/addressPools/1/start", "192.0.2.1", false],
    ["/networking/loadBalancing/addressPools/1/end", "192.0.2.8", false],
    ["/networking/dhcp/scopes/0/network", "192.0.2.0/24", true],
    ["/networking/dhcp/scopes/0/rangeStart", "192.0.2.10", false],
    ["/networking/dhcp/scopes/0/rangeEnd", "192.0.2.20", false],
    ["/networking/dhcp/scopes/0/gateway", "192.0.2.1", false],
    ["/networking/dhcp/scopes/0/reservations/0/address", "192.0.2.11", false],
  ]);
});

test("returns no fields when the record has no address pools", () => {
  expect(networkAddressPoolFields({})).toEqual([]);
});
