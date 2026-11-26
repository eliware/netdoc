import { expect, test } from "@jest/globals";
import interfaceLabel from "../../src/graph/interface-label.mjs";

test("labels interface fields and missing segment or connection", () => {
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
