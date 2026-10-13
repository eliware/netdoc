import { expect, test } from "@jest/globals";
import { validateInterfaceSegmentReferences } from "../src/validate-interface-segment-references.mjs";

test("checks interface segment references", () => {
  const record = {
    file: "router.yaml",
    data: { interfaces: [{ segmentId: 2n }, { segmentId: 3n }, {}] },
  };
  expect(
    validateInterfaceSegmentReferences(record, new Map([[2n, { kind: "network-segment" }]]))[0]
      .pointer,
  ).toBe("/interfaces/1/segmentId");
  expect(validateInterfaceSegmentReferences({ data: {} }, new Map())).toEqual([]);
});
