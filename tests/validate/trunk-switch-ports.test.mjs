import { expect, test } from "@jest/globals";
import { validateTrunkSwitchPorts } from "../../src/validate/trunk-switch-ports.mjs";

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
    [2n, { kind: "network-segment", record: { data: { vlan: "untagged" } } }],
    [3n, { kind: "network-segment", record: { data: { vlan: 3 } } }],
    [4n, { kind: "network-segment", invalid: true }],
  ]);
  expect(validateTrunkSwitchPorts([record], entities).map(({ pointer }) => pointer)).toEqual([
    "/switch/ports/0/segmentIds/0",
    "/switch/ports/0/pvidSegmentId",
    "/switch/ports/3/pvidSegmentId",
  ]);
  expect(validateTrunkSwitchPorts([{ data: {} }], new Map())).toEqual([]);
});

test("skips VLAN checks for PVID references to invalid segment records", () => {
  const record = {
    file: "switch.yaml",
    data: { id: 1n, switch: { ports: [{ mode: "trunk", pvidSegmentId: 5n }] } },
  };
  const entities = new Map([
    [5n, { kind: "network-segment", invalid: true, record: { data: { vlan: 2 } } }],
  ]);
  expect(validateTrunkSwitchPorts([record], entities)).toEqual([]);
});

test("does not apply VLAN rules to non-segment references", () => {
  const record = {
    file: "switch.yaml",
    data: {
      id: 1n,
      switch: { ports: [{ mode: "trunk", segmentIds: [2n], pvidSegmentId: 3n }] },
    },
  };
  const entities = new Map([
    [2n, { kind: "physical-machine", record: { data: { vlan: "untagged" } } }],
    [3n, { kind: "network-device", record: { data: { vlan: 3 } } }],
  ]);
  expect(validateTrunkSwitchPorts([record], entities)).toEqual([]);
});
