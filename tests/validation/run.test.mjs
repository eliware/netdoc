import { expect, test } from "@jest/globals";
import path from "node:path";
import { createMemoryFileSystem } from "../../test-fixtures/memory-file-system.mjs";
import { runInventoryValidation } from "../../src/validation/run.mjs";

test("returns setup errors without records", () => {
  const result = runInventoryValidation("missing", {
    cwd: path.resolve("run-validation-fixture"),
    fileSystem: createMemoryFileSystem(),
  });
  expect(result).toMatchObject({
    exitCode: 2,
    error: expect.stringContaining("Path does not exist"),
  });
  expect(result.records).toEqual([]);
});

test("uses the default working directory and filesystem", () => {
  expect(runInventoryValidation("missing-run-inventory-file")).toMatchObject({
    exitCode: 2,
    error: expect.stringContaining("Path does not exist"),
  });
});

test("returns validated records and diagnostics without writing output", () => {
  const root = path.resolve("run-validation-fixture");
  const file = path.join(root, "router.yaml");
  const fileSystem = createMemoryFileSystem({
    [file]:
      'version: "11.0"\nkind: network-device\nname: router\nroles: [router]\nimplementation: physical\n',
  });
  expect(runInventoryValidation(file, { fileSystem })).toMatchObject({
    exitCode: 0,
    fileCount: 1,
    diagnostics: [],
    records: [{ data: { name: "router" } }],
  });
});
