import { afterEach, expect, test } from "@jest/globals";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadInventory } from "../src/inventory-loader.mjs";

let directory;
afterEach(() => {
  if (directory) fs.rmSync(directory, { recursive: true, force: true });
  directory = undefined;
});

function makeDirectory() {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), "netdoc-loader-"));
  return directory;
}

test("loads one YAML file and a nested directory with exact integer values", () => {
  const root = makeDirectory();
  fs.mkdirSync(path.join(root, "nested"));
  fs.writeFileSync(path.join(root, "nested", "second.yaml"), "id: 9223372036854775807\n");
  fs.writeFileSync(path.join(root, "first.yml"), "kind: network-segment\n");
  fs.writeFileSync(path.join(root, "ignored.txt"), "not yaml\n");
  const result = loadInventory(root, { cwd: root });
  expect(result.records.map(({ file }) => file)).toEqual([
    "first.yml",
    path.join("nested", "second.yaml"),
  ]);
  expect(result.records[1].data.id).toBe(9223372036854775807n);
  expect(result.fileCount).toBe(2);
  expect(result.diagnostics).toEqual([]);
});

test("loads a single YAML file with the default working directory", () => {
  const root = makeDirectory();
  const file = path.join(root, "record.yaml");
  fs.writeFileSync(file, "kind: network-segment\n");
  expect(loadInventory(file).records).toHaveLength(1);
});

test("returns parse and document shape diagnostics", () => {
  const root = makeDirectory();
  fs.writeFileSync(path.join(root, "bad.yaml"), "kind: [broken\n");
  fs.writeFileSync(path.join(root, "array.yaml"), "- one\n- two\n");
  fs.writeFileSync(path.join(root, "multiple.yaml"), "kind: one\n---\nkind: two\n");
  const result = loadInventory(root, { cwd: root });
  expect(result.records).toEqual([]);
  expect(result.diagnostics).toHaveLength(3);
  expect(result.diagnostics.map(({ message }) => message)).toEqual(
    expect.arrayContaining([
      expect.stringContaining("YAML parse error"),
      "The YAML document must contain one object.",
      expect.stringContaining("YAML parse error"),
    ]),
  );
});

test.each([undefined, "", "missing.yaml"])("rejects an invalid input path %s", (target) => {
  const root = makeDirectory();
  expect(() => loadInventory(target, { cwd: root })).toThrow("Path does not exist:");
});

test("rejects a directory without YAML files", () => {
  const root = makeDirectory();
  fs.writeFileSync(path.join(root, "readme.txt"), "text\n");
  expect(() => loadInventory(root, { cwd: root })).toThrow("No YAML files found:");
});
