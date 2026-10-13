import { expect, test } from "@jest/globals";
import { validateTrunkSwitchPorts } from "../src/validate-trunk-switch-ports.mjs";

test("checks tagged segments and PVID membership on trunk ports", () => {
  const record = {
    file: "switch.yaml",
    data: {
      id: 1n,
      switch: {
        ports: [
          { mode: "trunk", segmentIds: [2n, 3n, 4n], pvidSegmentId: 2n },
          { mode: "trunk" },
          { mode: "access", segmentIds: [2n] },
          { mode: "trunk", pvidSegmentId: 3n },
        ],
      },
    },
  };
  const entities = new Map([
    [2n, { record: { data: { vlan: "untagged" } } }],
    [3n, { record: { data: { vlan: 3 } } }],
    [4n, { invalid: true }],
  ]);
  expect(validateTrunkSwitchPorts([record], entities).map(({ pointer }) => pointer)).toEqual([
    "/switch/ports/0/segmentIds/0",
    "/switch/ports/0/pvidSegmentId",
    "/switch/ports/3/pvidSegmentId",
  ]);
  expect(validateTrunkSwitchPorts([{ data: {} }], new Map())).toEqual([]);
});
