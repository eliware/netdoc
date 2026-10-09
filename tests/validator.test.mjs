import { afterEach, expect, test, jest } from "@jest/globals";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { validateInventory, validateTarget } from "../src/validator.mjs";

let directory;
afterEach(() => {
  if (directory) fs.rmSync(directory, { recursive: true, force: true });
  directory = undefined;
  jest.restoreAllMocks();
});

function makeDirectory() {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), "netdoc-validation-"));
  return directory;
}

function writeRecord(root, filename, content) {
  const file = path.join(root, filename);
  fs.writeFileSync(file, content);
  return file;
}

const validRecord =
  'version: "11.0"\nkind: network-device\nname: router\nroles: [router]\nimplementation: physical\n';

test("requires one validation path", () => {
  const error = jest.fn();
  expect(validateInventory([], { error })).toBe(2);
  expect(error).toHaveBeenCalledWith("Usage: netdoc validate <yaml-file-or-directory>");
  expect(validateInventory(["one", "two"], { error })).toBe(2);
});

test("uses default validation settings for a valid file", () => {
  const root = makeDirectory();
  const file = writeRecord(root, "record.yaml", validRecord);
  const write = jest.spyOn(console, "log").mockImplementation(() => {});
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(validateTarget(file)).toBe(0);
  expect(validateInventory([file])).toBe(0);
  expect(write).toHaveBeenCalledWith("Validated 1 YAML file(s).");
  expect(error).not.toHaveBeenCalled();
  expect(validateInventory([file], { write: jest.fn(), error: jest.fn() })).toBe(0);
});

test("rejects missing and empty paths", () => {
  const root = makeDirectory();
  const error = jest.fn();
  expect(validateTarget("missing", { cwd: root, error })).toBe(2);
  expect(validateTarget(undefined, { error })).toBe(2);
  expect(validateTarget("", { error })).toBe(2);
  expect(validateTarget(root, { error })).toBe(2);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("No YAML files found:"));
});

test("reports schema load errors", () => {
  const root = makeDirectory();
  const file = writeRecord(root, "record.yaml", validRecord);
  const error = jest.fn();
  expect(validateTarget(file, { schemaDirectory: path.join(root, "schemas"), error })).toBe(2);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("Could not load schemas:"));
});

test("reports parse errors, unsupported kinds, and schema errors", () => {
  const root = makeDirectory();
  writeRecord(root, "bad.yaml", "name: [broken\n");
  writeRecord(root, "kind.yaml", "name: unknown\n");
  writeRecord(root, "scalar.yaml", "just text\n");
  writeRecord(root, "null.yaml", "null\n");
  writeRecord(
    root,
    "schema.yaml",
    'version: "11.0"\nkind: network-device\nname: bad\nroles: [unknown]\nimplementation: physical\n',
  );
  writeRecord(root, "required.yaml", 'version: "11.0"\nkind: network-device\nname: broken\n');
  const error = jest.fn();
  expect(validateTarget(root, { error })).toBe(1);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("YAML parse error:"));
  expect(error).toHaveBeenCalledWith(expect.stringContaining("missing or unsupported object kind"));
  expect(error).toHaveBeenCalledWith(
    expect.stringContaining("must be equal to one of the allowed values"),
  );
  expect(error).toHaveBeenCalledWith(expect.stringContaining("required.yaml/:"));
  expect(error).toHaveBeenCalledWith(expect.stringContaining("Found "));
});
