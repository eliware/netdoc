import { expect, test } from "@jest/globals";
import path from "node:path";
import { createMemoryFileSystem } from "../../test-fixtures/memory-file-system.mjs";
import { collectYamlFiles } from "../../src/yaml/file-collection.mjs";

const root = path.resolve("yaml-files-fixture");

test("collects YAML files from nested folders in directory order", () => {
  const fileSystem = createMemoryFileSystem({
    [path.join(root, "a.yaml")]: "name: a\n",
    [path.join(root, "nested", "b.yml")]: "name: b\n",
    [path.join(root, "readme.txt")]: "text\n",
  });
  expect(collectYamlFiles(root, fileSystem).sort()).toEqual(
    [path.join(root, "a.yaml"), path.join(root, "nested", "b.yml")].sort(),
  );
});

test("returns a YAML file and skips a non-YAML file", () => {
  const yaml = path.join(root, "one.yml");
  const text = path.join(root, "note.txt");
  const fileSystem = createMemoryFileSystem({ [yaml]: "name: one\n", [text]: "note\n" });
  expect(collectYamlFiles(yaml, fileSystem)).toEqual([yaml]);
  expect(collectYamlFiles(text, fileSystem)).toEqual([]);
});

test("uses the default file system", () => {
  expect(collectYamlFiles(path.resolve("specs/schema/common.schema.yaml"))).toEqual([
    path.resolve("specs/schema/common.schema.yaml"),
  ]);
});

test("returns an empty list for an empty directory and throws for a missing path", () => {
  const fileSystem = createMemoryFileSystem({}, [root]);
  expect(collectYamlFiles(root, fileSystem)).toEqual([]);
  expect(() => collectYamlFiles(path.join(root, "missing"), fileSystem)).toThrow();
});
