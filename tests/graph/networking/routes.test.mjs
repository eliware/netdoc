import { expect, test } from "@jest/globals";
import { createGraphContext } from "../../../src/graph/context.mjs";
import { buildRouteElements } from "../../../src/graph/networking/routes.mjs";

test("links route destinations to matching segments and renders unmatched routes", () => {
  const router = { data: { kind: "network-device", networking: {} } };
  const segment = {
    data: { kind: "network-segment", ipNetworks: [{ cidr: "192.0.2.0/24" }] },
  };
  const context = createGraphContext([router, segment]);
  const elements = buildRouteElements(
    0,
    "object_0",
    {
      routing: {
        defaultGateway: "192.0.2.1",
        staticRoutes: [
          { destination: "192.0.2.0/24", nextHop: "192.0.2.2" },
          { destination: "198.51.100.0/24", interfaceName: "eth1" },
        ],
      },
    },
    context,
  );
  expect(elements.edges).toEqual([
    "object_0 -->|default gateway 192.0.2.1| object_1",
    "object_0 -->|route 192.0.2.0/24 via 192.0.2.2| object_1",
    "object_0 -->|static route| route_0_1",
  ]);
  expect(elements.nodes).toEqual([
    'route_0_1["Static route<br/>198.51.100.0/24<br/>Next hop: eth1"]',
  ]);
});

test("links a default route to a matching segment", () => {
  const router = { data: { kind: "network-device", networking: {} } };
  const segment = {
    data: { kind: "network-segment", ipNetworks: [{ cidr: "192.0.2.0/24" }] },
  };
  const context = createGraphContext([router, segment]);
  const elements = buildRouteElements(
    0,
    "object_0",
    { routing: { staticRoutes: [{ destination: "0.0.0.0/0", nextHop: "192.0.2.1" }] } },
    context,
  );

  expect(elements.edges).toEqual(["object_0 -->|route 0.0.0.0/0 via 192.0.2.1| object_1"]);
  expect(elements.nodes).toEqual([]);
});
