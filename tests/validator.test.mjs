import { afterEach, expect, test, jest } from "@jest/globals";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { validateTarget } from "../src/validator.mjs";

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

test("uses default validation settings for a valid file", () => {
  const root = makeDirectory();
  const file = writeRecord(root, "record.yaml", validRecord);
  const write = jest.spyOn(console, "log").mockImplementation(() => {});
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(validateTarget(file)).toBe(0);
  expect(write).toHaveBeenCalledWith("Validated 1 YAML file(s).");
  expect(error).not.toHaveBeenCalled();
});

test("reports target setup errors", () => {
  const root = makeDirectory();
  const file = writeRecord(root, "record.yaml", validRecord);
  const error = jest.fn();
  expect(validateTarget("missing", { cwd: root, error })).toBe(2);
  expect(validateTarget(undefined, { error })).toBe(2);
  expect(validateTarget("", { error })).toBe(2);
  expect(validateTarget(file, { schemaDirectory: path.join(root, "schemas"), error })).toBe(2);
  const empty = path.join(root, "empty");
  fs.mkdirSync(empty);
  expect(validateTarget(empty, { error })).toBe(2);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("Path does not exist:"));
  expect(error).toHaveBeenCalledWith(expect.stringContaining("No YAML files found:"));
  expect(error).toHaveBeenCalledWith(expect.stringContaining("Could not load schemas:"));
});

test("reports YAML parse errors", () => {
  const root = makeDirectory();
  writeRecord(root, "bad.yaml", "name: [broken\n");
  const error = jest.fn();
  expect(validateTarget(root, { error })).toBe(1);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("YAML parse error:"));
});

test("reports unsupported object kinds and schema violations", () => {
  const root = makeDirectory();
  writeRecord(root, "kind.yaml", "name: unknown\n");
  writeRecord(root, "unsupported.yaml", 'version: "11.0"\nkind: unknown\nname: unknown\n');
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
  expect(error).toHaveBeenCalledWith(expect.stringContaining("Missing or unsupported object kind"));
  expect(error).toHaveBeenCalledWith(
    expect.stringContaining("must be equal to one of the allowed values"),
  );
  expect(error).toHaveBeenCalledWith(expect.stringContaining("required.yaml:"));
  expect(error).toHaveBeenCalledWith(expect.stringContaining("Found "));
});

test("checks valid records when another record has a schema error", () => {
  const root = makeDirectory();
  writeRecord(
    root,
    "broken.yaml",
    'version: "11.0"\nkind: network-device\nname: broken\nroles: [unknown]\nimplementation: physical\n',
  );
  writeRecord(
    root,
    "router.yaml",
    'version: "11.0"\nkind: network-device\nname: router\nroles: [router]\nimplementation: physical\ninterfaces:\n  - name: eth0\n    type: ethernet\n    segmentId: 99\n',
  );
  const error = jest.fn();
  expect(validateTarget(root, { error })).toBe(1);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("allowed values"));
  expect(error).toHaveBeenCalledWith(
    expect.stringContaining("Reference 99 does not resolve to a network-segment."),
  );
});

test("checks record values when IDs conflict", () => {
  const root = makeDirectory();
  writeRecord(
    root,
    "first.yaml",
    'version: "11.0"\nkind: network-device\nid: 7\nname: first\nroles: [router]\nimplementation: physical\nnetworking:\n  routing:\n    defaultGateway: bad\n',
  );
  writeRecord(
    root,
    "second.yaml",
    'version: "11.0"\nkind: network-device\nid: 7\nname: second\nroles: [router]\nimplementation: physical\n',
  );
  const error = jest.fn();
  expect(validateTarget(root, { error })).toBe(1);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("already used"));
  expect(error).toHaveBeenCalledWith(
    expect.stringContaining("Invalid IP address or network 'bad'."),
  );
});
