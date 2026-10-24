import { expect, test } from "@jest/globals";
import { validateSwitchPortSegmentReferences } from "../../../../../src/validate/switch/port/segment/references.mjs";

test("reports missing and wrong-kind switch port segment references", () => {
  const record = {
    file: "switch.yaml",
    data: {
      switch: {
        ports: [{ segmentId: 2n, segmentIds: [3n], pvidSegmentId: 4n }, {}],
      },
    },
  };
  const entities = new Map([
    [2n, { kind: "network-segment" }],
    [3n, { kind: "physical-machine" }],
  ]);
  expect(
    validateSwitchPortSegmentReferences(record, entities).map(({ pointer }) => pointer),
  ).toEqual(["/switch/ports/0/segmentIds/0", "/switch/ports/0/pvidSegmentId"]);
  expect(validateSwitchPortSegmentReferences({ data: {} }, new Map())).toEqual([]);
});
