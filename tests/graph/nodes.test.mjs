import { expect, test } from "@jest/globals";
import { createGraphContext } from "../../src/graph/context.mjs";
import { buildInventoryNodes } from "../../src/graph/nodes.mjs";

test("builds nodes for inventory records and interfaces", () => {
  const records = [
    { data: { kind: "network-device", name: "router", interfaces: [{ name: "eth0" }] } },
    { data: { kind: "network-segment", name: "LAN", vlan: 10, ipNetworks: [] } },
  ];
  expect(buildInventoryNodes(createGraphContext(records))).toEqual([
    'object_0["network-device<br/>router"]',
    'interface_0_0["eth0<br/>Segment unknown<br/>Connection unknown"]',
    'object_1["network-segment<br/>LAN<br/>VLAN: 10"]',
  ]);
});
