import { expect, test } from "@jest/globals";
import { validateMacAddresses } from "../src/validate-mac-addresses.mjs";

test("finds duplicate MAC addresses on one segment across records", () => {
  const entities = new Map([[1n, { kind: "network-segment", record: { data: {} } }]]);
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
