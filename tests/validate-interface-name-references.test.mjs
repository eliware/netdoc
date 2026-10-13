import { expect, test } from "@jest/globals";
import { validateInterfaceNameReferences } from "../src/validate-interface-name-references.mjs";

test("checks parent interface references", () => {
  const record = {
    file: "router.yaml",
    data: { id: 1n, interfaces: [{ name: "eth0" }, { name: "eth0", parentInterface: "bad" }] },
  };
  expect(validateInterfaceNameReferences(record).map(({ message }) => message)).toEqual([
    "Interface name 'bad' does not exist in this record.",
  ]);
  expect(validateInterfaceNameReferences({ file: "empty.yaml", data: {} })).toEqual([]);
});
