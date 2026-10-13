import { expect, test } from "@jest/globals";
import { validateLocalSegmentReferences } from "../src/validate-local-segment-references.mjs";

test("checks interface and switch port segment references", () => {
  const record = {
    file: "router.yaml",
    data: {
      id: 1n,
      interfaces: [
        { name: "eth0", segmentId: 5n },
        { name: "eth1", segmentId: 6n },
        { name: "eth2" },
      ],
      switch: {
        ports: [{ segmentId: 7n }, { segmentIds: [8n] }, { pvidSegmentId: 9n }, {}],
      },
    },
  };
  const entities = new Map([[5n, { kind: "network-segment" }]]);
  expect(validateLocalSegmentReferences(record, entities)).toHaveLength(4);
  expect(validateLocalSegmentReferences({ data: {} }, new Map())).toEqual([]);
});
