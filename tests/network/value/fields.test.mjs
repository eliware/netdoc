import { expect, test } from "@jest/globals";
import { networkValueFields } from "../../../src/network/value/fields.mjs";

test("combines route, VRRP, tunnel, and policy groups in order", () => {
  const fields = networkValueFields({
    networking: {
      routing: { defaultGateway: "192.0.2.1", vrrp: [{ virtualAddresses: ["192.0.2.10"] }] },
      tunnels: [{ localAddress: "192.0.2.20" }],
      l2Announcements: [{ address: "192.0.2.30" }],
    },
  });
  expect(fields.map(([pointer]) => pointer)).toEqual([
    "/networking/routing/defaultGateway",
    "/networking/routing/bgp/routerId",
    "/networking/routing/vrrp/0/virtualAddresses/0",
    "/networking/tunnels/0/localAddress",
    "/networking/l2Announcements/0/address",
  ]);
});
