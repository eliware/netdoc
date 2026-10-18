import { expect, test } from "@jest/globals";
import { validateLocalReferences } from "../../../src/validate/local/references.mjs";

test("coordinates interface and network setting references", () => {
  const record = {
    file: "switch.yaml",
    data: {
      interfaces: [{ name: "known", parentInterface: "missing" }],
      networking: { tunnels: [{ interfaceName: "missing" }] },
    },
  };
  expect(validateLocalReferences(record).map(({ pointer }) => pointer)).toEqual([
    "/interfaces/0/parentInterface",
    "/networking/tunnels/0/interfaceName",
  ]);
});
