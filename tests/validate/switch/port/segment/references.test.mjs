import { expect, test } from "@jest/globals";
import { validateSwitchPortSegmentReferences } from "../../../../../src/validate/switch/port/segment/references.mjs";

test("reports missing and wrong-kind switch port segment references", () => {
  const record = {
    file: "switch.yaml",
    data: {
      switch: {
        ports: [{ segmentId: 2n, segmentIds: [3n] }, {}],
      },
    },
  };
  const entities = new Map([
    [2n, { kind: "network-segment" }],
    [3n, { kind: "physical-machine" }],
  ]);
  expect(
    validateSwitchPortSegmentReferences(record, entities).map(({ pointer }) => pointer),
  ).toEqual(["/switch/ports/0/segmentIds/0"]);
  expect(validateSwitchPortSegmentReferences({ data: {} }, new Map())).toEqual([]);
});
