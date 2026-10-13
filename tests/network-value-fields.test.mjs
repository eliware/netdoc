import { expect, test } from "@jest/globals";
import { networkValueFields } from "../src/network-value-fields.mjs";

test("collects network addresses with their schema paths and prefix rules", () => {
  expect(
    networkValueFields({
      networking: {
        routing: { defaultGateway: "192.0.2.1", staticRoutes: [{ destination: "0.0.0.0/0" }] },
      },
    }),
  ).toEqual([
    ["/networking/routing/defaultGateway", "192.0.2.1", false],
    ["/networking/routing/staticRoutes/0/destination", "0.0.0.0/0", true],
    ["/networking/routing/staticRoutes/0/nextHop", undefined, false],
    ["/networking/routing/bgp/routerId", undefined, false],
  ]);
});
