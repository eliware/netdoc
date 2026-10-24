import { expect, test } from "@jest/globals";
import { validateOverlayEndpointReferences } from "../../../../src/validate/network/overlays/endpoints.mjs";

test("validates endpoint objects, interface names, and underlay segments", () => {
  const record = {
    file: "overlay.yaml",
    data: {
      id: 1n,
      encapsulation: {
        underlaySegmentId: 2n,
        endpoints: [
          { nodeId: 1n, interfaceName: "missing" },
          { nodeId: 2n, interfaceName: "eth0" },
          { nodeId: 3n, interfaceName: "eth0" },
          { nodeId: 4n, interfaceName: "eth0" },
          { nodeId: 5n },
          { nodeId: 6n, interfaceName: "eth0" },
          { nodeId: 7n, interfaceName: "eth0" },
          { nodeId: 8n, interfaceName: "eth0" },
          { nodeId: 9n, interfaceName: "radio0" },
          { nodeId: 10n, interfaceName: "radio0" },
          { nodeId: 11n, interfaceName: "eth1" },
        ],
      },
    },
  };
  const entities = new Map([
    [1n, { kind: "virtual-machine", record: { data: { interfaces: [] } } }],
    [2n, { kind: "virtual-machine", invalid: true, record: { data: { interfaces: [] } } }],
    [3n, { kind: "wireless-network", record: { data: { interfaces: [] } } }],
    [
      4n,
      {
        kind: "physical-machine",
        record: { data: { interfaces: [{ name: "eth0", segmentId: 2n }] } },
      },
    ],
    [6n, { kind: "network-device", record: { data: { interfaces: [{ name: "eth0" }] } } }],
    [8n, { kind: "physical-machine", record: { data: {} } }],
    [
      9n,
      {
        kind: "network-device",
        record: {
          data: { interfaces: [{ name: "radio0", wireless: { broadcasts: [{ segmentId: 2n }] } }] },
        },
      },
    ],
    [
      10n,
      {
        kind: "network-device",
        record: {
          data: { interfaces: [{ name: "radio0", wireless: { broadcasts: [{ segmentId: 3n }] } }] },
        },
      },
    ],
    [11n, { kind: "physical-machine", record: { data: { interfaces: [{ name: "eth1" }] } } }],
  ]);

  expect(validateOverlayEndpointReferences(record, entities).map(({ pointer }) => pointer)).toEqual(
    [
      "/encapsulation/endpoints/2/nodeId",
      "/encapsulation/endpoints/4/nodeId",
      "/encapsulation/endpoints/6/nodeId",
      "/encapsulation/endpoints/0/interfaceName",
      "/encapsulation/endpoints/7/interfaceName",
      "/encapsulation/endpoints/9/interfaceName",
    ],
  );
});

test("accepts endpoints without named interfaces", () => {
  const record = {
    file: "overlay.yaml",
    data: { encapsulation: { endpoints: [{ nodeId: 3n }] } },
  };
  const entities = new Map([
    [3n, { kind: "virtual-machine", record: { data: { interfaces: [] } } }],
  ]);

  expect(validateOverlayEndpointReferences(record, entities)).toEqual([]);
  expect(validateOverlayEndpointReferences({ file: "plain.yaml", data: {} }, new Map())).toEqual(
    [],
  );
});
