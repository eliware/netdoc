import { expect, test } from "@jest/globals";
import { interfaceLabel, objectLabel, segmentLabel } from "../../src/graph/inventory-labels.mjs";

test("labels segments and interfaces with known inventory values", () => {
  expect(
    objectLabel({
      data: {
        kind: "network-segment",
        name: "LAN",
        vlan: "untagged",
        ipNetworks: [{ cidr: "192.0.2.0/24" }],
      },
    }),
  ).toEqual(["network-segment", "LAN", "VLAN: untagged", "192.0.2.0/24"]);
  expect(objectLabel({ data: { kind: "network-segment", name: "No IP" } })).toEqual([
    "network-segment",
    "No IP",
    "VLAN: unknown",
  ]);
  expect(interfaceLabel({})).toEqual([
    "Interface name unknown",
    "Segment unknown",
    "Connection unknown",
  ]);
  expect(
    interfaceLabel({
      name: "eth0",
      type: "ethernet",
      macAddress: "AA:BB:CC:DD:EE:FF",
      addresses: [{ cidr: "192.0.2.1/24" }],
      externalPeer: "ISP",
    }),
  ).toEqual([
    "eth0",
    "ethernet",
    "MAC: AA:BB:CC:DD:EE:FF",
    "Address: 192.0.2.1/24",
    "Segment unknown",
    "External peer: ISP",
  ]);
  expect(interfaceLabel({ name: "eth1", segmentId: 1n, connectsTo: 2n, unused: true })).toEqual([
    "eth1",
    "Unused",
  ]);
});

test("labels wireless segments and known addresses", () => {
  const networkInterface = {
    name: "radio0",
    addresses: [{ cidr: "192.0.2.1/24" }],
    wireless: { broadcasts: [{ wirelessNetworkId: 7n, segmentId: 3n }] },
  };
  const context = { recordById: new Map([[7n, { data: { name: "private5" } }]]) };
  expect(segmentLabel(networkInterface, 3n, context)).toBe(
    "radio0 / broadcast private5 / 192.0.2.1/24",
  );
  expect(segmentLabel(networkInterface, 4n, context)).toBe("radio0 / 192.0.2.1/24");
  expect(segmentLabel({}, 4n, { recordById: new Map() })).toBe("Interface");
});
