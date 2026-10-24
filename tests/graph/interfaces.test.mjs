import { expect, test } from "@jest/globals";
import { createGraphContext } from "../../src/graph/context.mjs";
import { buildInterfaceEdges } from "../../src/graph/interfaces.mjs";

test("links interfaces to segments, peer interfaces, and resident hosts", () => {
  const router = {
    data: {
      kind: "network-device",
      id: 1n,
      interfaces: [
        {
          id: 11n,
          name: "eth0",
          segmentId: 100n,
          connectsTo: 22n,
          addresses: [{ cidr: "192.0.2.1/24" }],
        },
        {
          name: "radio0",
          wireless: {
            broadcasts: [
              { wirelessNetworkId: 200n, segmentId: 100n },
              { wirelessNetworkId: 201n, segmentId: 101n },
            ],
          },
        },
      ],
    },
  };
  const machine = {
    data: {
      kind: "virtual-machine",
      id: 2n,
      residentOn: 1n,
      interfaces: [{ id: 22n, name: "eth1", connectsTo: 11n, segmentId: 100n }],
    },
  };
  const segment = { data: { kind: "network-segment", id: 100n } };
  const extraSegment = { data: { kind: "network-segment", id: 101n } };
  const wireless = { data: { kind: "wireless-network", id: 200n, name: "private5" } };
  const edges = buildInterfaceEdges(
    createGraphContext([router, machine, segment, extraSegment, wireless]),
  );
  expect(edges).toContain("object_0 -.->|interface| interface_0_0");
  expect(edges).toContain("interface_0_0 -->|eth0 / 192.0.2.1/24| object_2");
  expect(edges).toContain("interface_0_1 -->|radio0 / broadcast private5| object_2");
  expect(edges).toContain(
    "interface_0_1 -->|radio0 / broadcast wireless network unknown| object_3",
  );
  expect(edges).toContain("interface_0_0 ---|eth0 ↔ eth1| interface_1_0");
  expect(edges).toContain("object_1 -.->|runs on| object_0");
  expect(edges).toHaveLength(9);
});

test("skips missing segment and peer targets", () => {
  const record = {
    data: {
      kind: "network-device",
      residentOn: [99n],
      interfaces: [{ connectsTo: 99n, segmentId: 88n }],
    },
  };
  expect(buildInterfaceEdges(createGraphContext([record]))).toEqual([
    "object_0 -.->|interface| interface_0_0",
  ]);
});

test("uses a fallback label when an interface name is missing", () => {
  const record = { data: { kind: "physical-machine", interfaces: [{ segmentId: 1n }] } };
  const segment = { data: { kind: "network-segment", id: 1n } };
  expect(buildInterfaceEdges(createGraphContext([record, segment]))).toContain(
    "interface_0_0 -->|Interface| object_1",
  );
});
