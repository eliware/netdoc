import { expect, test } from "@jest/globals";
import { validateNetworkValues } from "../../../src/network/value/validation.mjs";

test("validates address values collected across network settings", () => {
  const data = {
    networking: {
      routing: { vrrp: [{ virtualAddresses: ["bad"] }] },
      l2Announcements: [{ address: "bad" }],
      tunnels: [{ localAddress: "bad", peers: [{ allowedNetworks: ["not-a-network"] }] }],
      firewall: { rules: [{ source: "bad" }] },
      loadBalancing: {
        addressPools: [{ cidr: "bad" }, { start: "192.0.2.20/24", end: "192.0.2.30/24" }],
      },
      dhcp: { scopes: [{ network: "bad" }] },
    },
  };
  expect(validateNetworkValues([{ file: "r.yaml", data }]).map(({ pointer }) => pointer)).toEqual([
    "/networking/routing/vrrp/0/virtualAddresses/0",
    "/networking/tunnels/0/localAddress",
    "/networking/tunnels/0/peers/0/allowedNetworks/0",
    "/networking/l2Announcements/0/address",
    "/networking/firewall/rules/0/source",
    "/networking/loadBalancing/addressPools/0/cidr",
    "/networking/loadBalancing/addressPools/1/start",
    "/networking/loadBalancing/addressPools/1/end",
    "/networking/dhcp/scopes/0/network",
  ]);
  expect(validateNetworkValues([{ file: "empty.yaml", data: {} }])).toEqual([]);
});
