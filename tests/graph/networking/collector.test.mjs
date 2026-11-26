import { expect, test } from "@jest/globals";
import collectNetworkingElements from "../../../src/graph/networking/collector.mjs";

test("collects and aggregates elements for every record and builder", () => {
  const first = { data: { networking: { listeners: ["first"] } } };
  const second = { data: {} };
  const context = {
    records: [first, second],
    objectNodeByRecord: new Map([
      [first, "object_0"],
      [second, "object_1"],
    ]),
  };
  const calls = [];
  const builders = [
    (index, source, networking) => {
      calls.push(["routes", index, source, networking]);
      return { nodes: [`route_${index}`], edges: [`route_edge_${index}`] };
    },
    (index, source, networking) => {
      calls.push(["tunnels", index, source, networking]);
      return { nodes: [`tunnel_${index}`], edges: [`tunnel_edge_${index}`] };
    },
  ];

  expect(collectNetworkingElements(context, builders)).toEqual({
    nodes: ["route_0", "tunnel_0", "route_1", "tunnel_1"],
    edges: ["route_edge_0", "tunnel_edge_0", "route_edge_1", "tunnel_edge_1"],
  });
  expect(calls).toEqual([
    ["routes", 0, "object_0", { listeners: ["first"] }],
    ["tunnels", 0, "object_0", { listeners: ["first"] }],
    ["routes", 1, "object_1", {}],
    ["tunnels", 1, "object_1", {}],
  ]);
});
