import { expect, test } from "@jest/globals";
import { validateOverlayReferences } from "../../../src/validate/network/overlays.mjs";

const vxlanSegment = (id) => ({
  kind: "network-segment",
  record: {
    data: {
      kind: "network-segment",
      id,
      encapsulation: { type: "vxlan", underlaySegmentId: 2n },
    },
  },
});

test("coordinates VXLAN segment, endpoint, and interface validation", () => {
  const record = {
    file: "overlay.yaml",
    data: {
      kind: "network-segment",
      id: 1n,
      encapsulation: {
        type: "vxlan",
        underlaySegmentId: 2n,
        endpoints: [{ nodeId: 3n, interfaceName: "eth0" }],
      },
      networking: { overlaySegmentIds: [4n] },
    },
  };
  const entities = new Map([
    [2n, { kind: "network-segment" }],
    [3n, { kind: "virtual-machine", record: { data: { interfaces: [{ name: "eth0" }] } } }],
    [4n, vxlanSegment(4n)],
  ]);

  expect(validateOverlayReferences(record, entities)).toEqual([]);
});
