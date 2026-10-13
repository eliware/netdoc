import { expect, test } from "@jest/globals";
import { networkTunnelValueFields } from "../src/network-tunnel-value-fields.mjs";

test("collects tunnel endpoints with and without allowed networks", () => {
  expect(
    networkTunnelValueFields({
      tunnels: [
        {
          localAddress: "192.0.2.1",
          peers: [{ endpointAddress: "192.0.2.2", allowedNetworks: ["198.51.100.0/24"] }],
        },
        { localAddress: "192.0.2.3", peers: [{ endpointAddress: "192.0.2.4" }] },
      ],
    }),
  ).toEqual([
    ["/networking/tunnels/0/localAddress", "192.0.2.1", false],
    ["/networking/tunnels/0/peers/0/endpointAddress", "192.0.2.2", false],
    ["/networking/tunnels/0/peers/0/allowedNetworks/0", "198.51.100.0/24", true],
    ["/networking/tunnels/1/localAddress", "192.0.2.3", false],
    ["/networking/tunnels/1/peers/0/endpointAddress", "192.0.2.4", false],
  ]);
});

test("collects tunnel addresses when peers or tunnels are absent", () => {
  expect(networkTunnelValueFields({ tunnels: [{}] })).toEqual([
    ["/networking/tunnels/0/localAddress", undefined, false],
  ]);
  expect(networkTunnelValueFields({})).toEqual([]);
});
