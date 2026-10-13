import { expect, test } from "@jest/globals";
import { validateLocalReferences } from "../src/validate-local-references.mjs";

test("checks local interface names", () => {
  const record = {
    file: "r.yaml",
    data: {
      kind: "network-device",
      interfaces: [{ name: "eth0", parentInterface: "bad" }, { name: "eth0" }],
    },
  };
  expect(validateLocalReferences(record)).toHaveLength(2);
  expect(validateLocalReferences({ file: "empty.yaml", data: {} }, new Map())).toEqual([]);
});

test("checks switch port interface names", () => {
  const record = {
    file: "switch.yaml",
    data: {
      interfaces: [{ name: "known" }],
      switch: { ports: [{ interfaceName: "missing" }] },
    },
  };
  expect(validateLocalReferences(record).map(({ pointer }) => pointer)).toEqual([
    "/switch/ports/0/interfaceName",
  ]);
});
