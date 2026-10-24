import { expect, test } from "@jest/globals";
import path from "node:path";
import { createMemoryFileSystem } from "../test-fixtures/memory-file-system.mjs";
import { loadInventory, tryLoadInventory } from "../src/inventory-loader.mjs";

const root = path.resolve("inventory-fixture");

test("loads valid YAML and reports per-file parse or document errors", () => {
  const fileSystem = createMemoryFileSystem({
    [path.join(root, "nested", "second.yaml")]: "id: 9223372036854775807\n",
    [path.join(root, "first.yml")]: "kind: network-segment\n",
    [path.join(root, "ignored.txt")]: "not yaml\n",
    [path.join(root, "bad.yaml")]: "kind: [broken\n",
    [path.join(root, "array.yaml")]: "- one\n- two\n",
    [path.join(root, "multiple.yaml")]: "kind: one\n---\nkind: two\n",
    [path.join(root, "record.yaml")]: "kind: network-segment\n",
  });
  const result = loadInventory(root, { cwd: root, fileSystem });
  expect(result.records.map(({ file }) => file)).toEqual([
    "first.yml",
    path.join("nested", "second.yaml"),
    "record.yaml",
  ]);
  expect(result.records[1].data.id).toBe(9223372036854775807n);
  expect(result.fileCount).toBe(6);
  expect(result.diagnostics).toHaveLength(3);
  expect(result.diagnostics.map(({ message }) => message)).toEqual(
    expect.arrayContaining([
      expect.stringContaining("YAML parse error"),
      "The YAML document must contain one object.",
    ]),
  );
  const single = loadInventory(path.join(root, "record.yaml"), { cwd: root, fileSystem });
  expect(single.records).toHaveLength(1);
  expect(single.fileCount).toBe(1);
  expect(single.diagnostics).toEqual([]);
});

test.each([undefined, "", "missing.yaml"])("rejects an invalid input path %s", (target) => {
  const fileSystem = createMemoryFileSystem({}, [root]);
  expect(() => loadInventory(target, { cwd: root, fileSystem })).toThrow("Path does not exist:");
  if (target === "missing.yaml")
    expect(tryLoadInventory(target, { cwd: root, fileSystem })).toEqual({
      error: `Path does not exist: ${path.join(root, target)}`,
    });
});

test("uses the default working directory and file system", () => {
  const inventory = loadInventory("specs/schema/common.schema.yaml");
  expect(inventory.fileCount).toBe(1);
  expect(inventory.records).toHaveLength(1);
});

test("rejects a directory without YAML files", () => {
  const fileSystem = createMemoryFileSystem({ [path.join(root, "readme.txt")]: "text\n" });
  expect(() => loadInventory(root, { cwd: root, fileSystem })).toThrow("No YAML files found:");
});
