import { expect, test } from "@jest/globals";
import path from "node:path";
import { createMemoryFileSystem } from "../test-fixtures/memory-file-system.mjs";
import tryLoadInventory from "../src/try-load-inventory.mjs";

test("returns path errors without throwing", () => {
  const root = path.resolve("inventory-fixture");
  const fileSystem = createMemoryFileSystem({}, [root]);
  expect(tryLoadInventory("missing.yaml", { cwd: root, fileSystem })).toEqual({
    error: `Path does not exist: ${path.join(root, "missing.yaml")}`,
  });
});
