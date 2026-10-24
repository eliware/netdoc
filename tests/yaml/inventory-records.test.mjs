import { expect, test } from "@jest/globals";
import path from "node:path";
import { createMemoryFileSystem } from "../../test-fixtures/memory-file-system.mjs";
import { parseInventoryRecords } from "../../src/yaml/inventory-records.mjs";

const root = path.resolve("inventory-records-fixture");

test("parses record objects and reports malformed or non-object documents", () => {
  const files = [
    path.join(root, "record.yaml"),
    path.join(root, "array.yaml"),
    path.join(root, "null.yaml"),
    path.join(root, "bad.yaml"),
    path.join(root, "multiple.yaml"),
  ];
  const fileSystem = createMemoryFileSystem({
    [files[0]]: "id: 9223372036854775807\n",
    [files[1]]: "- one\n- two\n",
    [files[2]]: "null\n",
    [files[3]]: "kind: [broken\n",
    [files[4]]: "kind: one\n---\nkind: two\n",
  });

  const result = parseInventoryRecords(files, { cwd: root, fileSystem });

  expect(result.records).toEqual([
    {
      file: "record.yaml",
      absoluteFile: files[0],
      data: { id: 9223372036854775807n },
    },
  ]);
  expect(result.diagnostics).toHaveLength(4);
  expect(result.diagnostics.map(({ message }) => message)).toEqual([
    "The YAML document must contain one object.",
    "The YAML document must contain one object.",
    expect.stringContaining("YAML parse error"),
    expect.stringContaining("YAML parse error"),
  ]);
});
