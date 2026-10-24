import { expect, test } from "@jest/globals";
import {
  edgeLine,
  escapeMermaidText,
  interfaceLabel,
  nodeLine,
  objectLabel,
} from "../../src/graph/labels.mjs";

test("escapes Mermaid text and formats nodes and edges", () => {
  expect(escapeMermaidText('A "B" & C | D\nE')).toBe("A &quot;B&quot; &amp; C &#124; D E");
  expect(escapeMermaidText(undefined)).toBe("");
  expect(nodeLine("node_1", ["Router", "eth0"])).toBe('node_1["Router<br/>eth0"]');
  expect(edgeLine("node_1", "node_2", "uplink", "---")).toBe("node_1 ---|uplink| node_2");
});

test("describes segments and interfaces with unknown relationship labels", () => {
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
