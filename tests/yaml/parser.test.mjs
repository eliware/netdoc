import { expect, test } from "@jest/globals";
import path from "node:path";
import { createMemoryFileSystem } from "../../test-fixtures/memory-file-system.mjs";
import { parseYamlFile } from "../../src/yaml/parser.mjs";

const file = path.resolve("yaml-parser-fixture/record.yaml");

test("parses YAML with optional BigInt integers and rejects duplicate keys", () => {
  const integerFileSystem = createMemoryFileSystem({ [file]: "id: 1234567890123456789\n" });
  expect(parseYamlFile(file, true, integerFileSystem).id).toBe(1234567890123456789n);
  expect(parseYamlFile(file, false, integerFileSystem).id).toBe(Number("1234567890123456789"));
  const duplicateKeyFileSystem = createMemoryFileSystem({ [file]: "name: first\nname: second\n" });
  expect(() => parseYamlFile(file, false, duplicateKeyFileSystem)).toThrow();
});

test("rejects multiple YAML documents", () => {
  const fileSystem = createMemoryFileSystem({ [file]: "name: first\n---\nname: second\n" });
  expect(() => parseYamlFile(file, false, fileSystem)).toThrow(
    "Expected one YAML document, found 2.",
  );
});
