import { expect, test } from "@jest/globals";
import { validateSwitchPorts } from "../src/validate-switch-ports.mjs";

test("combines access and trunk port diagnostics", () => {
  const record = {
    file: "sw.yaml",
    data: {
      id: 1n,
      interfaces: [{ name: "a", segmentId: 3n }],
      switch: {
        ports: [
          { interfaceName: "a", mode: "access", segmentId: 2n },
          { interfaceName: "b", mode: "trunk", segmentIds: [4n, 5n, 6n], pvidSegmentId: 4n },
          { interfaceName: "c2", mode: "trunk", segmentIds: [5n], pvidSegmentId: 4n },
          { interfaceName: "c3", mode: "trunk" },
          { interfaceName: "c", mode: "access", segmentId: 6n },
        ],
      },
    },
  };
  const entities = new Map([
    [4n, { record: { data: { vlan: "untagged" } } }],
    [5n, { record: { data: { vlan: 5 } } }],
  ]);
  expect(validateSwitchPorts([record], entities).map(({ pointer }) => pointer)).toEqual([
    "/switch/ports/0/segmentId",
    "/switch/ports/1/segmentIds/0",
    "/switch/ports/1/pvidSegmentId",
  ]);
  expect(validateSwitchPorts([{ file: "empty.yaml", data: {} }], new Map())).toEqual([]);
});
