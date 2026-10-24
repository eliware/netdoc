import { expect, test } from "@jest/globals";
import { networkRouteValueFields } from "../../../src/network/route/value-fields.mjs";
import { validateNetworkAddressFields } from "../../../src/validate/network/address/fields.mjs";

test("collects static route and BGP addresses and networks", () => {
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
      },
    }),
  ).toEqual([
    ["/networking/routing/defaultGateway", "192.0.2.1", false],
    ["/networking/routing/staticRoutes/0/destination", "192.0.2.0/24", true],
    ["/networking/routing/staticRoutes/0/nextHop", "192.0.2.1", false],
    ["/networking/routing/bgp/routerId", "192.0.2.2", false],
    ["/networking/routing/bgp/advertisedPrefixes/0", "198.51.100.0/24", true],
    ["/networking/routing/bgp/peers/0/address", "192.0.2.3", false],
  ]);
});

test("returns default gateway and BGP fields for an empty routing object", () => {
  expect(networkRouteValueFields({})).toEqual([
    ["/networking/routing/defaultGateway", undefined, false],
    ["/networking/routing/bgp/routerId", undefined, false],
  ]);
});

test("reports invalid route addresses", () => {
  expect(
    validateNetworkAddressFields(networkRouteValueFields({ routing: { defaultGateway: "bad" } }), {
      file: "router.yaml",
      data: { id: 1n },
    }).map(({ pointer }) => pointer),
  ).toEqual(["/networking/routing/defaultGateway"]);
});
