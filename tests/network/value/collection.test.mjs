import { expect, test } from "@jest/globals";
import { collectNetworkValueFields } from "../../../src/network/value/collection.mjs";

test("collects address fields from routing, policies, pools, and DHCP", () => {
  const data = {
    networking: {
      routing: { defaultGateway: "192.0.2.1", vrrp: [{ virtualAddresses: ["192.0.2.10"] }] },
      tunnels: [{ localAddress: "192.0.2.20" }],
      l2Announcements: [{ address: "192.0.2.30" }],
      loadBalancing: { addressPools: [{ cidr: "192.0.2.0/24" }] },
      dhcp: { scopes: [{ network: "192.0.2.0/24" }] },
    },
  };
  expect(collectNetworkValueFields(data).map(([pointer]) => pointer)).toEqual([
    "/networking/routing/defaultGateway",
    "/networking/routing/bgp/routerId",
    "/networking/routing/vrrp/0/virtualAddresses/0",
    "/networking/tunnels/0/localAddress",
    "/networking/l2Announcements/0/address",
    "/networking/loadBalancing/addressPools/0/cidr",
    "/networking/loadBalancing/addressPools/0/start",
    "/networking/loadBalancing/addressPools/0/end",
    "/networking/dhcp/scopes/0/network",
    "/networking/dhcp/scopes/0/rangeStart",
    "/networking/dhcp/scopes/0/rangeEnd",
    "/networking/dhcp/scopes/0/gateway",
  ]);
});

test("collects routing fields even when networking is absent", () => {
  expect(collectNetworkValueFields({})).toEqual([
    ["/networking/routing/defaultGateway", undefined, false],
    ["/networking/routing/bgp/routerId", undefined, false],
  ]);
});
