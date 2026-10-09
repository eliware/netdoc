import { expect, test } from "@jest/globals";
import { validateNetworkValues } from "../src/network-value-checks.mjs";

test("validates route, BGP, VRRP, announcement, and tunnel addresses", () => {
  const data = {
    networking: {
      routing: {
        defaultGateway: 17,
        staticRoutes: [{ destination: "0.0.0.0/0", nextHop: "192.0.2.1" }],
        bgp: { routerId: "192.0.2.1", advertisedPrefixes: ["bad"], peers: [{ address: "bad" }] },
        vrrp: [{ virtualAddresses: ["192.0.2.2"] }, {}],
      },
      l2Announcements: [{ address: "192.0.2.3" }],
      tunnels: [
        {},
        {
          localAddress: "192.0.2.4/24",
          peers: [{ endpointAddress: "192.0.2.5", allowedNetworks: ["192.0.2.0/24"] }, {}],
        },
      ],
      firewall: { rules: [{ source: "any", destination: "192.0.2.0/24" }] },
      nat: {
        rules: [{ source: "192.0.2.0/24", destination: "192.0.2.1", translation: "masquerade" }],
      },
      loadBalancing: {
        addressPools: [{ cidr: "192.0.2.1/32" }, { start: "192.0.2.2", end: "192.0.2.3" }],
        listeners: [{ address: "192.0.2.4", targets: [{ address: "192.0.2.5" }, {}] }, {}],
      },
      dhcp: {
        scopes: [
          {
            network: "192.0.2.0/24",
            rangeStart: "192.0.2.10",
            rangeEnd: "192.0.2.20",
            gateway: "192.0.2.1",
            reservations: [{ address: "192.0.2.11" }, {}],
          },
          {},
        ],
      },
    },
  };
  expect(validateNetworkValues([{ file: "r.yaml", data }])).toHaveLength(3);
  expect(validateNetworkValues([{ file: "empty.yaml", data: {} }])).toEqual([]);
});
