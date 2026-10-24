import { expect, test } from "@jest/globals";
import { collectNetworkValueFields } from "../../../src/network/value/collection.mjs";

test("collects address fields from routing, policies, pools, and DHCP", () => {
  const data = {
    networking: {
      routing: {
        defaultGateway: "192.0.2.1",
        staticRoutes: [{ destination: "198.51.100.0/24", nextHop: "192.0.2.2" }],
        bgp: {
          advertisedPrefixes: ["203.0.113.0/24"],
          peers: [{ address: "192.0.2.3" }],
        },
        vrrp: [{ virtualAddresses: ["192.0.2.10"] }],
      },
      tunnels: [{ localAddress: "192.0.2.20" }],
      l2Announcements: [{ address: "192.0.2.30" }],
      loadBalancing: {
        addressPools: [{ cidr: "192.0.2.0/24", start: "192.0.2.10", end: "192.0.2.20" }],
      },
      dhcp: {
        scopes: [
          {
            network: "192.0.2.0/24",
            rangeStart: "192.0.2.30",
            rangeEnd: "192.0.2.40",
            gateway: "192.0.2.1",
            reservations: [{ address: "192.0.2.31" }],
          },
        ],
      },
    },
  };
  expect(collectNetworkValueFields(data).map(([pointer]) => pointer)).toEqual([
    "/networking/routing/defaultGateway",
    "/networking/routing/staticRoutes/0/destination",
    "/networking/routing/staticRoutes/0/nextHop",
    "/networking/routing/bgp/routerId",
    "/networking/routing/bgp/advertisedPrefixes/0",
    "/networking/routing/bgp/peers/0/address",
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
    "/networking/dhcp/scopes/0/reservations/0/address",
  ]);
});

test("collects routing fields even when networking is absent", () => {
  expect(collectNetworkValueFields({})).toEqual([
    ["/networking/routing/defaultGateway", undefined, false],
    ["/networking/routing/bgp/routerId", undefined, false, { hostOnly: true }],
  ]);
});
