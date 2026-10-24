import { expect, test } from "@jest/globals";
import { networkTunnelValueFields } from "../../../src/network/tunnel/value-fields.mjs";
import { networkTunnelFields } from "../../../src/network/value/tunnel.mjs";

test("collects tunnel values through the existing tunnel collector", () => {
  const network = { tunnels: [{ localAddress: "192.0.2.1" }] };

  expect(networkTunnelFields(network)).toEqual(networkTunnelValueFields(network));
});
