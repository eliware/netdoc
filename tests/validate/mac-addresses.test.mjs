import { expect, test } from "@jest/globals";
import validateMacAddresses from "../../src/validate/mac-addresses.mjs";

test("finds duplicate MAC addresses on one segment across records", () => {
  const entities = new Map([
    [1n, { kind: "network-segment", record: { data: { kind: "network-segment" } } }],
  ]);
  const records = ["a", "b"].map((name, index) => ({
    file: `${name}.yaml`,
    data: {
      id: BigInt(index + 2),
      interfaces: [{ segmentId: 1n, macAddress: "AA-BB-CC-DD-EE-FF" }],
    },
  }));
  expect(validateMacAddresses(records, entities)).toHaveLength(1);
});

test("ignores missing MAC addresses and interfaces without a segment", () => {
  const records = [
    { file: "node.yaml", data: { id: 1n, interfaces: [{ segmentId: 1n }] } },
    { file: "other.yaml", data: { id: 2n, interfaces: [{ macAddress: "AA:BB:CC:DD:EE:FF" }] } },
  ];
  expect(validateMacAddresses(records, new Map())).toEqual([]);
});

test("finds duplicate radio MAC addresses on their broadcast segments", () => {
  const entities = new Map([
    [1n, { kind: "network-segment", record: { data: { kind: "network-segment" } } }],
  ]);
  const records = ["a", "b"].map((name, index) => ({
    file: `${name}.yaml`,
    data: {
      id: BigInt(index + 1),
      interfaces: [
        {
          macAddress: "AA-BB-CC-DD-EE-FF",
          wireless: { role: "radio", broadcasts: [{ segmentId: 1n }, { segmentId: 1n }] },
        },
      ],
    },
  }));
  expect(validateMacAddresses(records, entities)).toHaveLength(1);
});

test("finds duplicate client MAC addresses on profile segments", () => {
  const segment = { kind: "network-segment", record: { data: {} } };
  const accessPoint = {
    kind: "network-device",
    record: {
      data: {
        interfaces: [{ wireless: { broadcasts: [{ wirelessNetworkId: 3n, segmentId: 1n }] } }],
      },
    },
  };
  const entities = new Map([
    [1n, segment],
    [2n, accessPoint],
  ]);
  const records = ["a", "b"].map((name, index) => ({
    file: `${name}.yaml`,
    data: {
      id: BigInt(index + 3),
      interfaces: [
        {
          macAddress: "AA:BB:CC:DD:EE:FF",
          wireless: { role: "client", profiles: [{ wirelessNetworkId: 3n, accessPointId: 2n }] },
        },
      ],
    },
  }));

  expect(validateMacAddresses(records, entities)).toHaveLength(1);
});
