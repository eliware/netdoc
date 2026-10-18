import { expect, test } from "@jest/globals";
import { validateIdentifiers } from "../../src/validate/identifiers.mjs";

test("accepts object and interface IDs without losing integer precision", () => {
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
  expect(validateIdentifiers(records)).toEqual([]);
});

test("reports duplicate IDs across objects and interfaces", () => {
  const diagnostics = validateIdentifiers([
    { file: "one.yaml", data: { kind: "physical-machine", id: 10n } },
    {
      file: "two.yaml",
      data: { kind: "network-device", id: 10n, interfaces: [{ id: 10n }] },
    },
  ]);
  expect(diagnostics).toHaveLength(2);
  expect(diagnostics.map(({ message }) => message)).toEqual([
    "This ID is in use at one.yaml#/id.",
    "This ID is in use at one.yaml#/id.",
  ]);
});

test("reports out-of-range BIGINT IDs and skips absent or non-integer IDs", () => {
  const diagnostics = validateIdentifiers([
    { file: "low.yaml", data: { kind: "physical-machine", id: 0n } },
    { file: "high.yaml", data: { kind: "physical-machine", id: 9223372036854775808n } },
    { file: "optional.yaml", data: { kind: "physical-machine", interfaces: [{ name: "eth0" }] } },
    { file: "schema-error.yaml", data: { kind: "physical-machine", id: "10" } },
  ]);
  expect(diagnostics).toHaveLength(2);
  expect(diagnostics[0].message).toContain("outside the positive signed 64-bit range");
});
