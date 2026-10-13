import { expect, test } from "@jest/globals";
import { networkRouteValueFields } from "../src/network-route-value-fields.mjs";

test("collects routing addresses, networks, BGP peers, and virtual addresses", () => {
  expect(
    networkRouteValueFields({
      routing: {
        defaultGateway: "192.0.2.1",
        staticRoutes: [{ destination: "192.0.2.0/24", nextHop: "192.0.2.1" }],
        bgp: {
          routerId: "192.0.2.2",
          advertisedPrefixes: ["198.51.100.0/24"],
          peers: [{ address: "192.0.2.3" }],
        },
        vrrp: [{ virtualAddresses: ["192.0.2.4"] }],
      },
    }),
  ).toEqual([
    ["/networking/routing/defaultGateway", "192.0.2.1", false],
    ["/networking/routing/staticRoutes/0/destination", "192.0.2.0/24", true],
    ["/networking/routing/staticRoutes/0/nextHop", "192.0.2.1", false],
    ["/networking/routing/bgp/routerId", "192.0.2.2", false],
    ["/networking/routing/bgp/advertisedPrefixes/0", "198.51.100.0/24", true],
    ["/networking/routing/bgp/peers/0/address", "192.0.2.3", false],
    ["/networking/routing/vrrp/0/virtualAddresses/0", "192.0.2.4", false],
  ]);
});

test("returns default gateway and BGP fields for an empty routing object", () => {
  expect(networkRouteValueFields({})).toEqual([
    ["/networking/routing/defaultGateway", undefined, false],
    ["/networking/routing/bgp/routerId", undefined, false],
  ]);
});
