import { expect, test } from "@jest/globals";
import { validateSwitchPortReferences } from "../../../../src/validate/switch/port/references.mjs";

test("checks switch port references against local interface names", () => {
  const record = {
    file: "switch.yaml",
    data: {
      id: 2n,
      interfaces: [{ name: "known" }],
      switch: { ports: [{ interfaceName: "known" }, { interfaceName: "missing" }] },
    },
  };
  expect(validateSwitchPortReferences(record).map(({ pointer }) => pointer)).toEqual([
    "/switch/ports/1/interfaceName",
  ]);
  expect(validateSwitchPortReferences({ file: "empty.yaml", data: {} })).toEqual([]);
});
