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
