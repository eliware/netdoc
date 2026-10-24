import { expect, test } from "@jest/globals";
import { buildTunnelElements } from "../../../src/graph/networking/tunnels.mjs";

test("renders tunnel peers with default labels when details are absent", () => {
  expect(buildTunnelElements(1, "object_1", { tunnels: [{ peers: [{}] }] })).toEqual({
    nodes: [
      'tunnel_1_0["Configured tunnel<br/>Local: unknown<br/>Listen port: unknown"]',
      'tunnel_peer_1_0_0["Tunnel peer<br/>Endpoint unknown:port unknown<br/>Allowed networks: unknown"]',
    ],
    edges: [
      "object_1 -.->|tunnel configuration| tunnel_1_0",
      "tunnel_1_0 -.->|configured peer| tunnel_peer_1_0_0",
    ],
  });
});

test("links a tunnel peer to its uniquely matching interface address", () => {
  const context = {
    records: [
      {
        data: {
          interfaces: [
            { addresses: [{ cidr: "203.0.113.2/32" }] },
            { addresses: [{ cidr: "203.0.113.3/24" }] },
            {},
          ],
        },
      },
    ],
  };

  expect(
    buildTunnelElements(
      0,
      "object_0",
      { tunnels: [{ peers: [{ endpointAddress: "203.0.113.2", endpointPort: 51820 }] }] },
      context,
    ).edges,
  ).toEqual([
    "object_0 -.->|tunnel configuration| tunnel_0_0",
    "tunnel_0_0 -.->|configured peer| tunnel_peer_0_0_0",
    "tunnel_peer_0_0_0 -.->|known endpoint| interface_0_0",
  ]);
});

test("does not guess when a tunnel peer address has multiple interface matches", () => {
  const records = [
    { data: { interfaces: [{ addresses: [{ cidr: "203.0.113.2/32" }] }] } },
    { data: { interfaces: [{ addresses: [{ cidr: "203.0.113.2/24" }] }] } },
  ];
  const elements = buildTunnelElements(
    0,
    "object_0",
    { tunnels: [{ peers: [{ endpointAddress: "203.0.113.2" }] }] },
    { records },
  );

  expect(elements.edges).toEqual([
    "object_0 -.->|tunnel configuration| tunnel_0_0",
    "tunnel_0_0 -.->|configured peer| tunnel_peer_0_0_0",
  ]);
});

test("does not match a tunnel endpoint that includes a prefix", () => {
  expect(
    buildTunnelElements(
      0,
      "object_0",
      { tunnels: [{ peers: [{ endpointAddress: "203.0.113.2/24" }] }] },
      { records: [{ data: { interfaces: [{ addresses: [{ cidr: "203.0.113.2/32" }] }] } }] },
    ).edges,
  ).toHaveLength(2);
});
