import { expect, test } from "@jest/globals";
import interfaceLabel from "../../../src/graph/interface/label.mjs";

test("formats interface values and supplied unknown states", () => {
  expect(
    interfaceLabel(
      {
        type: "ethernet",
        macAddress: "AA:BB:CC:DD:EE:FF",
        addresses: [{ cidr: "192.0.2.1/24" }],
        externalPeer: "ISP",
      },
      { segmentUnknown: true, connectionUnknown: false },
    ),
  ).toEqual([
    "Interface name unknown",
    "ethernet",
    "MAC: AA:BB:CC:DD:EE:FF",
    "Address: 192.0.2.1/24",
    "Segment unknown",
    "External peer: ISP",
  ]);
});

test("formats known connections and unused interfaces", () => {
  expect(
    interfaceLabel(
      { name: "eth1", segmentId: 1n, connectsTo: 2n, unused: true },
      { segmentUnknown: false, connectionUnknown: false },
    ),
  ).toEqual(["eth1", "Unused"]);
});
