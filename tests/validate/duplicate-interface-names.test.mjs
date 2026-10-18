import { expect, test } from "@jest/globals";
import { validateDuplicateInterfaceNames } from "../../src/validate/duplicate-interface-names.mjs";

test("reports duplicate names and accepts unique or absent names", () => {
  const record = {
    file: "router.yaml",
    data: { id: 1n, interfaces: [{ name: "eth0" }, { name: "eth0" }, {}] },
  };
  expect(validateDuplicateInterfaceNames(record).map(({ pointer }) => pointer)).toEqual([
    "/interfaces/0/name",
  ]);
  expect(validateDuplicateInterfaceNames({ file: "empty.yaml", data: {} })).toEqual([]);
});
