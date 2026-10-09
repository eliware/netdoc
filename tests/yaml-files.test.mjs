import { afterEach, expect, test } from "@jest/globals";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  collectYamlFiles,
  convertBigIntsForValidation,
  parseYamlFile,
} from "../src/yaml-files.mjs";

let directory;
afterEach(() => {
  if (directory) fs.rmSync(directory, { recursive: true, force: true });
  directory = undefined;
});

function makeDirectory() {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), "netdoc-yaml-"));
  return directory;
}

test("collects YAML files from nested folders in directory order", () => {
  const root = makeDirectory();
  fs.mkdirSync(path.join(root, "nested"));
  fs.writeFileSync(path.join(root, "a.yaml"), "name: a\n");
  fs.writeFileSync(path.join(root, "nested", "b.yml"), "name: b\n");
  fs.writeFileSync(path.join(root, "readme.txt"), "text\n");
  expect(collectYamlFiles(root)).toEqual([
    path.join(root, "a.yaml"),
    path.join(root, "nested", "b.yml"),
  ]);
});

test("returns a YAML file and skips a non-YAML file", () => {
  const root = makeDirectory();
  const yaml = path.join(root, "one.yml");
  const text = path.join(root, "note.txt");
  fs.writeFileSync(yaml, "name: one\n");
  fs.writeFileSync(text, "note\n");
  expect(collectYamlFiles(yaml)).toEqual([yaml]);
  expect(collectYamlFiles(text)).toEqual([]);
});

test("returns an empty list for an empty directory and throws for a missing path", () => {
  const root = makeDirectory();
  expect(collectYamlFiles(root)).toEqual([]);
  expect(() => collectYamlFiles(path.join(root, "missing"))).toThrow();
});

test("parses YAML with optional BigInt integers and rejects duplicate keys", () => {
  const root = makeDirectory();
  const file = path.join(root, "record.yaml");
  fs.writeFileSync(file, "id: 1234567890123456789\n");
  expect(parseYamlFile(file, true).id).toBe(1234567890123456789n);
  expect(parseYamlFile(file).id).toBe(Number("1234567890123456789"));
  fs.writeFileSync(file, "name: first\nname: second\n");
  expect(() => parseYamlFile(file)).toThrow();
});

test("rejects multiple YAML documents", () => {
  const root = makeDirectory();
  const file = path.join(root, "record.yaml");
  fs.writeFileSync(file, "name: first\n---\nname: second\n");
  expect(() => parseYamlFile(file)).toThrow("Expected one YAML document, found 2.");
});

test("converts nested BigInts for JSON schema validation and preserves other values", () => {
  const date = new Date("2026-01-01T00:00:00Z");
  expect(convertBigIntsForValidation({ id: 5n, values: [7n, null], date })).toEqual({
    id: 5,
    values: [7, null],
    date,
  });
  expect(convertBigIntsForValidation("value")).toBe("value");
});
