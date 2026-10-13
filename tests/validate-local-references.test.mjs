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

test("coordinates interface, switch port, and network setting references", () => {
  const record = {
    file: "switch.yaml",
    data: {
      interfaces: [{ name: "known", parentInterface: "missing" }],
      switch: { ports: [{ interfaceName: "missing" }] },
      networking: { tunnels: [{ interfaceName: "missing" }] },
    },
  };
  expect(validateLocalReferences(record).map(({ pointer }) => pointer)).toEqual([
    "/interfaces/0/parentInterface",
    "/switch/ports/0/interfaceName",
    "/networking/tunnels/0/interfaceName",
  ]);
});
