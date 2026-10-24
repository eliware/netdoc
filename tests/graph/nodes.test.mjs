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

test("labels a wireless client with a known profile segment", () => {
  const records = [
    {
      data: {
        kind: "network-device",
        name: "access point",
        interfaces: [
          {
            name: "radio0",
            wireless: { broadcasts: [{ wirelessNetworkId: 2n, segmentId: 3n }] },
          },
        ],
      },
    },
    {
      data: {
        kind: "network-device",
        name: "client",
        interfaces: [
          {
            name: "wifi0",
            type: "wireless",
            wireless: { role: "client", profiles: [{ wirelessNetworkId: 2n }] },
          },
        ],
      },
    },
    { data: { kind: "wireless-network", id: 2n, name: "private5" } },
    { data: { kind: "network-segment", id: 3n, name: "home" } },
  ];
  expect(buildInventoryNodes(createGraphContext(records))).toContain(
    'interface_1_0["wifi0<br/>wireless<br/>Connection unknown"]',
  );
});
