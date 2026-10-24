import { expect, test } from "@jest/globals";
import { networkRouteValueFields } from "../../../src/network/route/value-fields.mjs";
import { networkRoutingFields } from "../../../src/network/value/routing.mjs";
import { networkVrrpValueFields } from "../../../src/network/vrrp-value-fields.mjs";

test("collects routing and VRRP values through their existing collectors", () => {
  const network = {
    routing: {
      staticRoutes: [{ destination: "192.0.2.0/24" }],
      vrrp: [{ virtualAddresses: ["192.0.2.1"] }],
    },
  };

  expect(networkRoutingFields(network)).toEqual([
    ...networkRouteValueFields(network),
    ...networkVrrpValueFields(network),
  ]);
});
