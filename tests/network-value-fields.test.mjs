import { expect, test } from "@jest/globals";
import { networkValueFields } from "../src/network-value-fields.mjs";

test("combines values from route, tunnel, and VRRP field groups", () => {
  expect(
    networkValueFields({
      networking: {
        routing: { vrrp: [{ virtualAddresses: ["192.0.2.10"] }] },
        tunnels: [{ localAddress: "192.0.2.20" }],
      },
    }),
  ).toEqual([
    ["/networking/routing/defaultGateway", undefined, false],
    ["/networking/routing/bgp/routerId", undefined, false],
    ["/networking/routing/vrrp/0/virtualAddresses/0", "192.0.2.10", false],
    ["/networking/tunnels/0/localAddress", "192.0.2.20", false],
  ]);
});
