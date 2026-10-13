import { expect, test } from "@jest/globals";
import { validateLocalReferences } from "../src/validate-local-references.mjs";

test("coordinates interface, switch port, and network setting references", () => {
  const record = {
    file: "switch.yaml",
    data: {
      interfaces: [{ name: "known", parentInterface: "missing" }],
      switch: { ports: [{ interfaceName: "known" }] },
      networking: { tunnels: [{ interfaceName: "missing" }] },
    },
  };
  expect(validateLocalReferences(record).map(({ pointer }) => pointer)).toEqual([
    "/interfaces/0/parentInterface",
    "/networking/tunnels/0/interfaceName",
  ]);
});
