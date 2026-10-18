import { expect, test } from "@jest/globals";
import { validateHostReferences } from "../../src/validate/host-references.mjs";

test("checks VM and network-device host kinds", () => {
  const entities = new Map([
    [1n, { kind: "physical-machine" }],
    [2n, { kind: "virtual-machine" }],
  ]);
  expect(
    validateHostReferences(
      { file: "vm.yaml", data: { kind: "virtual-machine", residentOn: 1n } },
      entities,
    ),
  ).toEqual([]);
  expect(
    validateHostReferences(
      { file: "device.yaml", data: { kind: "network-device", residentOn: [1n, 2n, 9n] } },
      entities,
    ),
  ).toHaveLength(1);
  expect(validateHostReferences({ file: "other.yaml", data: { kind: "other" } }, entities)).toEqual(
    [],
  );
  expect(
    validateHostReferences({ file: "device.yaml", data: { kind: "network-device" } }, entities),
  ).toEqual([]);
});
