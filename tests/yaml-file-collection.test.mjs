import { afterEach, expect, test } from "@jest/globals";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { collectYamlFiles } from "../src/yaml-file-collection.mjs";

let directory;
afterEach(() => {
  if (directory) fs.rmSync(directory, { recursive: true, force: true });
  directory = undefined;
});

function makeDirectory() {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), "netdoc-yaml-files-"));
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
