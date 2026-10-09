import { expect, test } from "@jest/globals";
import { validateIdentifiers } from "../src/validate-identifiers.mjs";

test("indexes object and interface IDs without losing integer precision", () => {
  const records = [
    {
      file: "router.yaml",
      data: {
        kind: "network-device",
        id: 9223372036854775807n,
        interfaces: [{ name: "port", id: 9223372036854775806n }],
      },
    },
  ];
  const result = validateIdentifiers(records);
  expect(result.entitiesById.get(9223372036854775807n).kind).toBe("network-device");
  expect(result.entitiesById.get(9223372036854775806n).kind).toBe("interface");
  expect(result.diagnostics).toEqual([]);
});

test("reports duplicate IDs across objects and interfaces", () => {
  const result = validateIdentifiers([
    { file: "one.yaml", data: { kind: "physical-machine", id: 10n } },
    {
      file: "two.yaml",
      data: { kind: "network-device", id: 10n, interfaces: [{ id: 10n }] },
    },
  ]);
  expect(result.diagnostics).toHaveLength(2);
  expect(result.diagnostics.map(({ message }) => message)).toEqual([
    "This ID is already used at one.yaml#/id.",
    "This ID is already used at one.yaml#/id.",
  ]);
});

test("reports out-of-range BIGINT IDs and skips absent or non-integer IDs", () => {
  const result = validateIdentifiers([
    { file: "low.yaml", data: { kind: "physical-machine", id: 0n } },
    { file: "high.yaml", data: { kind: "physical-machine", id: 9223372036854775808n } },
    { file: "optional.yaml", data: { kind: "physical-machine", interfaces: [{ name: "eth0" }] } },
    { file: "schema-error.yaml", data: { kind: "physical-machine", id: "10" } },
  ]);
  expect(result.diagnostics).toHaveLength(2);
  expect(result.diagnostics[0].message).toContain("outside the positive signed 64-bit range");
});
