import { expect, test } from "@jest/globals";
import { validateLocalReferences } from "../src/validate-local-references.mjs";

test("checks local names and segment references", () => {
  const record = {
    file: "r.yaml",
    data: {
      kind: "network-device",
      interfaces: [{ name: "eth0", parentInterface: "bad", segmentId: 7n }, { name: "eth0" }],
      switch: { ports: [{ interfaceName: "bad", segmentIds: [8n], pvidSegmentId: 9n }] },
    },
  };
  expect(validateLocalReferences(record, new Map())).toHaveLength(6);
  expect(validateLocalReferences({ file: "empty.yaml", data: {} }, new Map())).toEqual([]);
});

test("checks L2 announcement interfaces on their referenced node", () => {
  const entities = new Map([[1n, { record: { data: { interfaces: [{ name: "eth0" }] } } }]]);
  const good = {
    file: "cilium.yaml",
    data: { networking: { l2Announcements: [{ nodeId: 1n, interfaceName: "eth0" }] } },
  };
  const bad = {
    file: "cilium.yaml",
    data: { networking: { l2Announcements: [{ nodeId: 2n, interfaceName: "eth1" }] } },
  };
  expect(validateLocalReferences(good, entities)).toEqual([]);
  expect(validateLocalReferences(bad, entities)).toHaveLength(1);
});
