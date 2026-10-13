import { afterEach, expect, test } from "@jest/globals";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseYamlFile } from "../src/yaml-parser.mjs";

let directory;
afterEach(() => {
  if (directory) fs.rmSync(directory, { recursive: true, force: true });
  directory = undefined;
});

function makeFile(content) {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), "netdoc-yaml-parser-"));
  const file = path.join(directory, "record.yaml");
  fs.writeFileSync(file, content);
  return file;
}

test("parses YAML with optional BigInt integers and rejects duplicate keys", () => {
  const file = makeFile("id: 1234567890123456789\n");
  expect(parseYamlFile(file, true).id).toBe(1234567890123456789n);
  expect(parseYamlFile(file).id).toBe(Number("1234567890123456789"));
  fs.writeFileSync(file, "name: first\nname: second\n");
  expect(() => parseYamlFile(file)).toThrow();
});

test("rejects multiple YAML documents", () => {
  const file = makeFile("name: first\n---\nname: second\n");
  expect(() => parseYamlFile(file)).toThrow("Expected one YAML document, found 2.");
});
