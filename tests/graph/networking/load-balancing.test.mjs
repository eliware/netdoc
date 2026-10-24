import { expect, test } from "@jest/globals";
import { createGraphContext } from "../../../src/graph/context.mjs";
import { buildLoadBalancingElements } from "../../../src/graph/networking/load-balancing.mjs";

test("returns empty elements when no listeners exist", () => {
  expect(buildLoadBalancingElements(0, "object_0", {}, {})).toEqual({ nodes: [], edges: [] });
});

test("renders load-balancer listeners and address or device targets", () => {
  const router = {
    data: {
      kind: "network-device",
      id: 1n,
      networking: {
        loadBalancing: {
          addressPools: [{ cidr: "10.0.0.0/24" }, { start: "10.0.1.1", end: "10.0.1.20" }],
          listeners: [
            {
              protocol: "TCP",
              port: 443,
              address: "203.0.113.10",
              targets: [
                { deviceId: 2n, address: "10.0.0.2", port: 8443 },
                { address: "10.0.0.3" },
                { deviceId: 2n, port: 22 },
                { deviceId: 2n },
              ],
            },
            { protocol: "UDP", port: 53 },
          ],
        },
      },
    },
  };
  const backend = { data: { kind: "virtual-machine", id: 2n, name: "backend" } };
  const context = createGraphContext([router, backend]);
  const elements = buildLoadBalancingElements(0, "object_0", router.data.networking, context);

  expect(elements.nodes).toContain(
    'listener_0_0["Load balancer listener<br/>TCP:443<br/>Address: 203.0.113.10"]',
  );
  expect(elements.nodes).toContain('listener_target_0_0_1["Load balancer target<br/>10.0.0.3"]');
  expect(elements.edges).toContain("object_0 -->|load balancer listener| listener_0_0");
  expect(elements.edges).toContain("listener_0_0 -->|target 10.0.0.2:8443| object_1");
  expect(elements.edges).toContain("listener_0_0 -->|target| listener_target_0_0_1");
  expect(elements.edges).toContain("listener_0_0 -->|target device 2 port 22| object_1");
  expect(elements.edges).toContain("listener_0_0 -->|target device 2| object_1");
  expect(elements.nodes).toContain('listener_0_1["Load balancer listener<br/>UDP:53"]');
  expect(elements.nodes).toContain(
    'address_pool_0_0["Load balancer address pool<br/>10.0.0.0/24"]',
  );
  expect(elements.nodes).toContain(
    'address_pool_0_1["Load balancer address pool<br/>10.0.1.1 - 10.0.1.20"]',
  );
  expect(elements.edges).toContain("object_0 -->|address pool| address_pool_0_0");
});
