import { expect, test } from "@jest/globals";
import { validateSwitchPortSegmentReferences } from "../../../../src/validate/switch/port/segment-references.mjs";

test("checks switch port segment, VLAN list, and PVID references", () => {
  const record = {
    file: "switch.yaml",
    data: {
      switch: {
        ports: [{ segmentId: 2n, segmentIds: [3n], pvidSegmentId: 4n }, {}],
      },
    },
  };
  expect(
    validateSwitchPortSegmentReferences(record, new Map()).map(({ pointer }) => pointer),
  ).toEqual([
    "/switch/ports/0/segmentId",
    "/switch/ports/0/segmentIds/0",
    "/switch/ports/0/pvidSegmentId",
  ]);
  expect(validateSwitchPortSegmentReferences({ data: {} }, new Map())).toEqual([]);
});
