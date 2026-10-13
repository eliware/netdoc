import { expect, test } from "@jest/globals";
import { validateLocalObjectReferences } from "../src/validate-local-object-references.mjs";

test("checks interface and switch port segment references", () => {
  const record = {
    file: "router.yaml",
    data: {
      id: 1n,
      interfaces: [
        { name: "eth0", segmentId: 5n },
        { name: "eth1", segmentId: 6n },
      ],
      switch: {
        ports: [{ segmentId: 7n }, { segmentIds: [8n] }, { pvidSegmentId: 9n }],
      },
    },
  };
  const entities = new Map([[5n, { kind: "network-segment" }]]);
  expect(validateLocalObjectReferences(record, entities)).toHaveLength(4);
});

test("checks L2 announcement interface names on the referenced object", () => {
  const record = {
    file: "cilium.yaml",
    data: {
      id: 2n,
      networking: {
        l2Announcements: [
          { nodeId: 1n, interfaceName: "eth0" },
          { nodeId: 3n, interfaceName: "eth1" },
        ],
      },
    },
  };
  const entities = new Map([[1n, { record: { data: { interfaces: [{ name: "eth0" }] } } }]]);
  expect(validateLocalObjectReferences(record, entities).map(({ message }) => message)).toEqual([
    "Interface name 'eth1' does not exist on the referenced object.",
  ]);
  expect(validateLocalObjectReferences({ file: "empty.yaml", data: {} }, new Map())).toEqual([]);
});
