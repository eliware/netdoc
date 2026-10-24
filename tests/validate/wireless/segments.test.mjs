import { expect, test } from "@jest/globals";
import { validateWirelessSegmentReferences } from "../../../src/validate/wireless/segments.mjs";

test("validates segment references for wireless broadcasts", () => {
  const record = {
    file: "ap.yaml",
    data: {
      interfaces: [{ wireless: { broadcasts: [{ segmentId: 2n }, { segmentId: 3n }] } }],
    },
  };
  const diagnostics = validateWirelessSegmentReferences(
    record,
    new Map([[2n, { kind: "network-segment" }]]),
  );
  expect(diagnostics.map(({ pointer }) => pointer)).toEqual([
    "/interfaces/0/wireless/broadcasts/1/segmentId",
  ]);
});

test("accepts records without wireless broadcasts", () => {
  expect(
    validateWirelessSegmentReferences(
      { file: "empty.yaml", data: { interfaces: [{}, { wireless: {} }] } },
      new Map(),
    ),
  ).toEqual([]);
});
