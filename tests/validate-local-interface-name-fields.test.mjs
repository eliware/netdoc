import { expect, test } from "@jest/globals";
import { validateLocalInterfaceNameFields } from "../src/validate-local-interface-name-fields.mjs";

test("reports unknown parent and switch interface names", () => {
  const record = { file: "router.yaml", data: { id: 3n } };
  const diagnostics = validateLocalInterfaceNameFields(
    [
      ["/interfaces/0/parentInterface", "eth9"],
      ["/switch/ports/0/interfaceName", "eth8"],
      ["/known", "eth0"],
      ["/empty", undefined],
    ],
    record,
    new Set(["eth0"]),
  );
  expect(diagnostics.map(({ pointer }) => pointer)).toEqual([
    "/interfaces/0/parentInterface",
    "/switch/ports/0/interfaceName",
  ]);
});
