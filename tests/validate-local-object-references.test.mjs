import { expect, test } from "@jest/globals";
import { validateLocalObjectReferences } from "../src/validate-local-object-references.mjs";

test("combines segment and announcement interface reference checks", () => {
  const record = {
    file: "device.yaml",
    data: {
      id: 1n,
      interfaces: [{ name: "eth0", segmentId: 5n }],
      networking: { l2Announcements: [{ nodeId: 2n, interfaceName: "eth9" }] },
    },
  };
  const entities = new Map([
    [2n, { record: { data: { interfaces: [{ name: "eth0" }] } } }],
    [5n, { kind: "network-segment" }],
  ]);
  expect(validateLocalObjectReferences(record, entities).map(({ pointer }) => pointer)).toEqual([
    "/networking/l2Announcements/0/interfaceName",
  ]);
  expect(validateLocalObjectReferences({ file: "empty.yaml", data: {} }, new Map())).toEqual([]);
});
