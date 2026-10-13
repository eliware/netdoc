import { expect, test } from "@jest/globals";
import { validateLocalReferences } from "../src/validate-local-references.mjs";
import { validateLocalObjectReferences } from "../src/validate-local-object-references.mjs";
import { validateSwitchPorts } from "../src/validate-switch-ports.mjs";

test("checks access segment agreement and trunk VLAN membership", () => {
  const record = {
    file: "sw.yaml",
    data: {
      id: 1n,
      interfaces: [{ name: "a", segmentId: 2n }],
      switch: {
        ports: [
          { interfaceName: "a", mode: "access", segmentId: 3n },
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
  expect(validateSwitchPorts([record], entities)).toHaveLength(3);
  expect(validateSwitchPorts([{ file: "empty.yaml", data: {} }], new Map())).toEqual([]);
});

test("checks switch port interface and segment references", () => {
  const record = {
    file: "sw.yaml",
    data: {
      id: 1n,
      interfaces: [{ name: "known" }],
      switch: {
        ports: [
          { interfaceName: "missing", mode: "access", segmentId: 2n },
          { interfaceName: "known", mode: "trunk", segmentIds: [3n], pvidSegmentId: 4n },
        ],
      },
    },
  };
  expect(validateLocalReferences(record)).toHaveLength(1);
  expect(validateLocalObjectReferences(record, new Map())).toHaveLength(3);
});
