import { expect, test } from "@jest/globals";
import { validateNetworkSegmentReference } from "../src/validate-network-segment-reference.mjs";

test("accepts an unset or valid segment reference", () => {
  const record = { file: "node.yaml", data: { id: 1n } };
  const entities = new Map([[2n, { kind: "network-segment" }]]);
  expect(validateNetworkSegmentReference(undefined, record, "/segmentId", entities)).toEqual([]);
  expect(validateNetworkSegmentReference(2n, record, "/segmentId", entities)).toEqual([]);
});

test("reports a missing or wrong-kind segment reference", () => {
  const record = { file: "node.yaml", data: { id: 1n } };
  const diagnostics = validateNetworkSegmentReference(
    2n,
    record,
    "/segmentId",
    new Map([[2n, { kind: "host" }]]),
  );
  expect(diagnostics[0].message).toBe("Reference 2 does not resolve to a network-segment.");
});
