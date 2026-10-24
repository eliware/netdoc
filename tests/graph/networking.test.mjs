import { expect, test } from "@jest/globals";
import { createGraphContext } from "../../src/graph/context.mjs";
import { buildNetworkingElements } from "../../src/graph/networking.mjs";

test("renders gateways, routes, BGP, VRRP, and tunnel relationships", () => {
  const router = {
    data: {
      kind: "network-device",
      id: 1n,
      networking: {
        routing: {
          defaultGateway: "192.0.2.254",
          staticRoutes: [
            { destination: "192.0.2.0/24", nextHop: "192.0.2.254" },
            { destination: "198.51.100.0/24", interfaceName: "eth1" },
          ],
          bgp: {
            localAs: 64512,
            peers: [
              { peerId: 2n, address: "192.0.2.2", remoteAs: 64513 },
              { address: "192.0.2.3", remoteAs: 64514 },
            ],
          },
          vrrp: [{ vrid: 4, interfaceName: "eth0", virtualAddresses: ["192.0.2.10"] }],
        },
        tunnels: [
          {
            type: "wireguard",
            localAddress: "203.0.113.1",
            listenPort: 51820,
            peers: [
              {
                endpointAddress: "203.0.113.2",
                endpointPort: 51820,
                allowedNetworks: ["10.0.0.0/24"],
              },
              {},
            ],
          },
        ],
      },
    },
  };
  const peer = { data: { kind: "network-device", id: 2n, name: "peer" } };
  const segment = { data: { kind: "network-segment", ipNetworks: [{ cidr: "192.0.2.0/24" }] } };
  const elements = buildNetworkingElements(createGraphContext([router, peer, segment]));
  expect(elements.edges).toContain("object_0 -->|default gateway 192.0.2.254| object_2");
  expect(elements.edges).toContain("object_0 -->|route 192.0.2.0/24 via 192.0.2.254| object_2");
  expect(elements.nodes).toContain(
    'route_0_1["Static route<br/>198.51.100.0/24<br/>Next hop: eth1"]',
  );
  expect(elements.edges).toContain("object_0 -->|BGP AS 64512 to 64513 / 192.0.2.2| object_1");
  expect(elements.nodes).toContain(
    'bgp_peer_0_1["BGP peer<br/>192.0.2.3<br/>BGP AS 64512 to 64514"]',
  );
  expect(elements.nodes).toContain('vrrp_0_0["Configured VRRP<br/>VRID 4<br/>192.0.2.10"]');
  expect(elements.nodes).toContain(
    'tunnel_0_0["Configured wireguard<br/>Local: 203.0.113.1<br/>Listen port: 51820"]',
  );
  expect(elements.nodes).toContain(
    'tunnel_peer_0_0_1["Tunnel peer<br/>Endpoint unknown:port unknown<br/>Allowed networks: unknown"]',
  );
});

test("marks unmatched gateways and route destinations as unknown", () => {
  const record = {
    data: {
      kind: "network-device",
      networking: {
        routing: {
          defaultGateway: "192.0.2.1",
          staticRoutes: [
            { destination: "198.51.100.0/24", nextHop: "192.0.2.2" },
            { destination: "203.0.113.0/24" },
          ],
          bgp: { peers: [{}] },
          vrrp: [{ vrid: 4, virtualAddresses: [] }],
        },
        tunnels: [{}],
      },
    },
  };
  const segment = { data: { kind: "network-segment", ipNetworks: undefined } };
  const elements = buildNetworkingElements(createGraphContext([record, segment]));
  expect(elements.nodes).toContain(
    'gateway_0["Default gateway<br/>192.0.2.1<br/>Segment unknown"]',
  );
  expect(elements.edges).toContain("object_0 -->|default gateway| gateway_0");
  expect(elements.nodes).toContain(
    'route_0_0["Static route<br/>198.51.100.0/24<br/>Next hop: 192.0.2.2"]',
  );
  expect(elements.nodes).toContain(
    'route_0_1["Static route<br/>203.0.113.0/24<br/>Next hop: unknown"]',
  );
  expect(elements.nodes).toContain(
    'bgp_peer_0_0["BGP peer<br/>Address unknown<br/>BGP AS unknown to unknown"]',
  );
  expect(elements.edges).toContain("object_0 -->|VRRP interface unknown| vrrp_0_0");
  expect(elements.nodes).toContain(
    'tunnel_0_0["Configured tunnel<br/>Local: unknown<br/>Listen port: unknown"]',
  );
});

test("handles empty optional BGP peer and VRRP address lists", () => {
  const record = {
    data: {
      kind: "network-device",
      networking: { routing: { bgp: {}, vrrp: [{ vrid: 7 }] } },
    },
  };
  const elements = buildNetworkingElements(createGraphContext([record]));
  expect(elements.nodes).toContain('vrrp_0_0["Configured VRRP<br/>VRID 7"]');
  expect(elements.edges).toContain("object_0 -->|VRRP interface unknown| vrrp_0_0");
});
