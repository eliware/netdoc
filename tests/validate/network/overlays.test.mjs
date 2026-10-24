import { expect, test } from "@jest/globals";
import { validateOverlayReferences } from "../../../src/validate/network/overlays.mjs";

const vxlanSegment = (id, overrides = {}) => ({
  kind: "network-segment",
  record: {
    data: {
      kind: "network-segment",
      id,
      encapsulation: { type: "vxlan", underlaySegmentId: 2n },
      ...overrides,
    },
  },
});

test("validates Cilium overlay, underlay, endpoint, and interface references", () => {
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

test("reports missing, wrong-kind, and non-VXLAN segment references", () => {
  const record = {
    file: "device.yaml",
    data: {
      kind: "network-device",
      networking: { overlaySegmentIds: [1n, 2n, 3n, 4n] },
    },
  };
  const entities = new Map([
    [2n, { kind: "virtual-machine" }],
    [3n, { kind: "network-segment", record: { data: { kind: "network-segment" } } }],
    [4n, { kind: "network-segment", invalid: true, record: { data: { kind: "network-segment" } } }],
  ]);

  expect(validateOverlayReferences(record, entities).map(({ pointer }) => pointer)).toEqual([
    "/networking/overlaySegmentIds/0",
    "/networking/overlaySegmentIds/1",
    "/networking/overlaySegmentIds/2",
  ]);
});

test("skips invalid overlay records and validates underlay segment kind", () => {
  const record = {
    file: "overlay.yaml",
    data: {
      kind: "network-segment",
      encapsulation: { type: "vxlan", underlaySegmentId: 2n },
    },
  };
  expect(
    validateOverlayReferences(record, new Map([[2n, { kind: "network-device", invalid: true }]])),
  ).toEqual([]);
  expect(validateOverlayReferences(record, new Map([[2n, { kind: "network-device" }]]))).toEqual([
    expect.objectContaining({ pointer: "/encapsulation/underlaySegmentId" }),
  ]);
  expect(validateOverlayReferences({ file: "plain.yaml", data: {} }, new Map())).toEqual([]);
});

test("validates endpoint object references and interface names", () => {
  const record = {
    file: "overlay.yaml",
    data: {
      kind: "network-segment",
      encapsulation: {
        endpoints: [
          { nodeId: 1n, interfaceName: "missing" },
          { nodeId: 2n, interfaceName: "eth0" },
          { nodeId: 3n, interfaceName: "eth0" },
          { nodeId: 4n, interfaceName: "eth0" },
          { nodeId: 5n },
          { nodeId: 6n, interfaceName: "eth0" },
          { nodeId: 7n, interfaceName: "eth0" },
          { nodeId: 8n, interfaceName: "eth0" },
        ],
      },
    },
  };
  const entities = new Map([
    [1n, { kind: "virtual-machine", record: { data: { interfaces: [] } } }],
    [2n, { kind: "virtual-machine", invalid: true, record: { data: { interfaces: [] } } }],
    [3n, { kind: "wireless-network", record: { data: { interfaces: [] } } }],
    [4n, { kind: "physical-machine", record: { data: { interfaces: [{ name: "eth0" }] } } }],
    [6n, { kind: "network-device", record: { data: { interfaces: [{ name: "eth0" }] } } }],
    [8n, { kind: "physical-machine", record: { data: {} } }],
  ]);

  expect(validateOverlayReferences(record, entities).map(({ pointer }) => pointer)).toEqual([
    "/encapsulation/endpoints/2/nodeId",
    "/encapsulation/endpoints/4/nodeId",
    "/encapsulation/endpoints/6/nodeId",
    "/encapsulation/endpoints/0/interfaceName",
    "/encapsulation/endpoints/7/interfaceName",
  ]);
});

test("reports an endpoint interface on the wrong underlay segment", () => {
  const record = {
    file: "overlay.yaml",
    data: {
      kind: "network-segment",
      encapsulation: {
        underlaySegmentId: 2n,
        endpoints: [{ nodeId: 3n, interfaceName: "eth0" }],
      },
    },
  };
  const entities = new Map([
    [2n, { kind: "network-segment" }],
    [
      3n,
      {
        kind: "virtual-machine",
        record: { data: { interfaces: [{ name: "eth0", segmentId: 4n }] } },
      },
    ],
  ]);

  expect(validateOverlayReferences(record, entities)).toEqual([
    expect.objectContaining({
      pointer: "/encapsulation/endpoints/0/interfaceName",
      message: "Interface 'eth0' does not use the referenced underlay segment.",
    }),
  ]);
});

test("uses wireless radio broadcasts to check overlay endpoint segments", () => {
  const record = {
    file: "overlay.yaml",
    data: {
      kind: "network-segment",
      encapsulation: {
        underlaySegmentId: 2n,
        endpoints: [{ nodeId: 3n, interfaceName: "radio0" }],
      },
    },
  };
  const makeEntities = (segmentId) =>
    new Map([
      [2n, { kind: "network-segment" }],
      [
        3n,
        {
          kind: "network-device",
          record: {
            data: {
              interfaces: [
                {
                  name: "radio0",
                  wireless: { broadcasts: [{ wirelessNetworkId: 4n, segmentId }] },
                },
              ],
            },
          },
        },
      ],
    ]);

  expect(validateOverlayReferences(record, makeEntities(2n))).toEqual([]);
  expect(validateOverlayReferences(record, makeEntities(4n))).toEqual([
    expect.objectContaining({
      pointer: "/encapsulation/endpoints/0/interfaceName",
      message: "Interface 'radio0' does not use the referenced underlay segment.",
    }),
  ]);
});
