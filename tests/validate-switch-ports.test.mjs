import { expect, test } from "@jest/globals";
import { validateSwitchPorts } from "../src/validate-switch-ports.mjs";

test("combines access and trunk port diagnostics", () => {
  const record = {
    file: "sw.yaml",
    data: {
      id: 1n,
      interfaces: [
        { name: "a", segmentId: 3n },
        { name: "c2" },
        { name: "c3" },
        { name: "c", segmentId: 6n },
      ],
      switch: {
        ports: [
          { interfaceName: "a", mode: "access", segmentId: 2n },
          { interfaceName: "missing", mode: "trunk", segmentIds: [4n, 5n], pvidSegmentId: 4n },
          { interfaceName: "c2", mode: "trunk", segmentIds: [5n], pvidSegmentId: 4n },
          { interfaceName: "c3", mode: "trunk" },
          { interfaceName: "c", mode: "access", segmentId: 6n },
        ],
      },
    },
  };
  const entities = new Map([
    [2n, { kind: "network-segment", record: { data: { vlan: 2 } } }],
    [3n, { kind: "network-segment", record: { data: { vlan: 3 } } }],
    [4n, { kind: "network-segment", record: { data: { vlan: "untagged" } } }],
    [5n, { kind: "network-segment", record: { data: { vlan: 5 } } }],
    [6n, { kind: "network-segment", record: { data: { vlan: 6 } } }],
  ]);
  expect(validateSwitchPorts([record], entities).map(({ pointer }) => pointer)).toEqual([
    "/switch/ports/1/interfaceName",
    "/switch/ports/0/segmentId",
    "/switch/ports/1/segmentIds/0",
    "/switch/ports/1/pvidSegmentId",
  ]);
  expect(validateSwitchPorts([{ file: "empty.yaml", data: {} }], new Map())).toEqual([]);
});
