import { expect, test } from "@jest/globals";
import { buildLoadBalancingTargetElements } from "../../../src/graph/networking/targets.mjs";

test("renders known device targets and standalone target nodes", () => {
  const elements = buildLoadBalancingTargetElements(
    1,
    2,
    "listener_1_2",
    [
      { deviceId: 3n, address: "10.0.0.3", port: 443 },
      { deviceId: 3n, port: 22 },
      { deviceId: 4n, address: "10.0.0.4" },
      { deviceId: 5n },
    ],
    { objectNodeById: new Map([[3n, "object_3"]]) },
  );

  expect(elements.nodes).toEqual([
    'listener_target_1_2_2["Load balancer target<br/>10.0.0.4"]',
    'listener_target_1_2_3["Load balancer target<br/>device 5"]',
  ]);
  expect(elements.edges).toEqual([
    "listener_1_2 -->|target 10.0.0.3:443| object_3",
    "listener_1_2 -->|target device 3 port 22| object_3",
    "listener_1_2 -->|target| listener_target_1_2_2",
    "listener_1_2 -->|target| listener_target_1_2_3",
  ]);
  expect(
    buildLoadBalancingTargetElements(0, 0, "listener_0_0", [], { objectNodeById: new Map() }),
  ).toEqual({ nodes: [], edges: [] });
});
