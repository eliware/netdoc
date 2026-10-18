import { expect, test } from "@jest/globals";
import { validateNetworkValues } from "../../../src/network/value/validation.mjs";

test("validates address values collected across network settings", () => {
  const data = {
    networking: {
      routing: { defaultGateway: "bad", vrrp: [{ virtualAddresses: ["bad"] }] },
      l2Announcements: [{ address: "bad" }],
      tunnels: [{ localAddress: "bad" }],
      firewall: { rules: [{ source: "bad" }] },
      nat: { rules: [{ destination: "bad" }] },
      loadBalancing: {
        addressPools: [{ cidr: "bad" }, { start: "192.0.2.20/24", end: "192.0.2.30/24" }],
        listeners: [{ address: "bad" }],
      },
      dhcp: { scopes: [{ network: "bad" }] },
    },
  };
  expect(validateNetworkValues([{ file: "r.yaml", data }]).map(({ pointer }) => pointer)).toEqual([
    "/networking/routing/defaultGateway",
    "/networking/routing/vrrp/0/virtualAddresses/0",
    "/networking/tunnels/0/localAddress",
    "/networking/l2Announcements/0/address",
    "/networking/firewall/rules/0/source",
    "/networking/nat/rules/0/destination",
    "/networking/loadBalancing/listeners/0/address",
    "/networking/loadBalancing/addressPools/0/cidr",
    "/networking/loadBalancing/addressPools/1/start",
    "/networking/loadBalancing/addressPools/1/end",
    "/networking/dhcp/scopes/0/network",
  ]);
  expect(validateNetworkValues([{ file: "empty.yaml", data: {} }])).toEqual([]);
});
