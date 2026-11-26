import { expect, test } from "@jest/globals";
import validateOverlayEndpointInterfaces from "../../../../src/validate/network/overlays/interfaces.mjs";

test("checks endpoint interfaces and underlay membership", () => {
  const record = {
    file: "overlay.yaml",
    data: {
      encapsulation: {
        underlaySegmentId: 2n,
        endpoints: [
          { nodeId: 1n, interfaceName: "eth0" },
          { nodeId: 2n, interfaceName: "missing" },
          { nodeId: 3n, interfaceName: "eth0" },
          { nodeId: 4n, interfaceName: "eth0" },
          { nodeId: 5n },
          { nodeId: 6n, interfaceName: "eth1" },
          { nodeId: 7n, interfaceName: "eth0" },
          { nodeId: 8n, interfaceName: "eth0" },
        ],
      },
    },
  };
  const entities = new Map([
    [
      1n,
      {
        kind: "physical-machine",
        record: { data: { interfaces: [{ name: "eth0", segmentId: 2n }] } },
      },
    ],
    [2n, { kind: "virtual-machine", record: { data: {} } }],
    [3n, { kind: "physical-machine", invalid: true, record: { data: { interfaces: [] } } }],
    [4n, { kind: "wireless-network", record: { data: { interfaces: [] } } }],
    [6n, { kind: "network-device", record: { data: { interfaces: [{ name: "eth1" }] } } }],
    [
      7n,
      {
        kind: "virtual-machine",
        record: { data: { interfaces: [{ name: "eth0", segmentId: 3n }] } },
      },
    ],
    [
      8n,
      {
        kind: "network-device",
        record: {
          data: {
            interfaces: [{ name: "eth0", wireless: { broadcasts: [{ segmentId: 2n }] } }],
          },
        },
      },
    ],
  ]);

  expect(
    validateOverlayEndpointInterfaces(record.data.encapsulation.endpoints, record, entities).map(
      ({ pointer }) => pointer,
    ),
  ).toEqual([
    "/encapsulation/endpoints/1/interfaceName",
    "/encapsulation/endpoints/6/interfaceName",
  ]);
});

test("accepts matching underlays and interfaces without segment assignments", () => {
  const record = {
    file: "overlay.yaml",
    data: { encapsulation: { endpoints: [{ nodeId: 1n, interfaceName: "eth0" }] } },
  };
  const entities = new Map([
    [1n, { kind: "physical-machine", record: { data: { interfaces: [{ name: "eth0" }] } } }],
  ]);
  expect(
    validateOverlayEndpointInterfaces(record.data.encapsulation.endpoints, record, entities),
  ).toEqual([]);
});
