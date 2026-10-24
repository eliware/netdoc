import { expect, test } from "@jest/globals";
import { validateOverlaySegmentReferences } from "../../../../src/validate/network/overlays/segments.mjs";

const record = (data = {}) => ({ file: "overlay.yaml", data: { id: 1n, ...data } });
const segment = (kind = "network-segment", data = {}) => ({ kind, record: { data } });

test("accepts VXLAN overlay and underlay segment references", () => {
  const entities = new Map([
    [2n, segment("network-segment", { encapsulation: { type: "vxlan" } })],
    [3n, segment()],
  ]);
  expect(
    validateOverlaySegmentReferences(
      record({ networking: { overlaySegmentIds: [2n] }, encapsulation: { underlaySegmentId: 3n } }),
      entities,
    ),
  ).toEqual([]);
});

test("reports invalid overlay and underlay segment references", () => {
  const entities = new Map([
    [2n, segment("virtual-machine", {})],
    [3n, segment()],
    [4n, { ...segment(), invalid: true }],
    [5n, segment("network-device")],
  ]);
  const diagnostics = validateOverlaySegmentReferences(
    record({
      networking: { overlaySegmentIds: [1n, 2n, 3n, 4n] },
      encapsulation: { underlaySegmentId: 5n },
    }),
    entities,
  );

  expect(diagnostics.map(({ pointer }) => pointer)).toEqual([
    "/networking/overlaySegmentIds/0",
    "/networking/overlaySegmentIds/1",
    "/networking/overlaySegmentIds/2",
    "/encapsulation/underlaySegmentId",
  ]);
});

test("skips invalid segment records and absent references", () => {
  const entities = new Map([
    [2n, { ...segment(), invalid: true }],
    [3n, { ...segment("network-device"), invalid: true }],
  ]);
  expect(
    validateOverlaySegmentReferences(
      record({ networking: { overlaySegmentIds: [2n] }, encapsulation: { underlaySegmentId: 3n } }),
      entities,
    ),
  ).toEqual([]);
  expect(validateOverlaySegmentReferences(record(), new Map())).toEqual([]);
});
