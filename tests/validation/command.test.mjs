import { expect, jest, test } from "@jest/globals";
import path from "node:path";
import { createMemoryFileSystem } from "../../test-fixtures/memory-file-system.mjs";
import { validateInventory } from "../../src/validation/command.mjs";

test("stops before validation when arguments include extra paths", () => {
  const error = jest.fn();
  const write = jest.fn();
  expect(validateInventory(["one", "two"], { error, write })).toBe(2);
  expect(write).not.toHaveBeenCalled();
});

test("uses default options when a target path does not exist", () => {
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(validateInventory(["missing-validation-command-target"])).toBe(2);
  expect(error).toHaveBeenCalled();
  error.mockRestore();
});

test("validates a record and reports the result", () => {
  const root = path.resolve("command-fixture");
  const file = path.join(root, "record.yaml");
  const fileSystem = createMemoryFileSystem({
    [file]:
      'version: "11.0"\nkind: network-device\nname: router\nroles: [router]\nimplementation: physical\n',
  });
  const write = jest.fn();
  const error = jest.fn();

  expect(validateInventory([file], { write, error, fileSystem })).toBe(0);
  expect(write).toHaveBeenCalledWith("Validated 1 YAML file(s).");
  expect(error).not.toHaveBeenCalled();
});

test("writes one JSON document for successful validation", () => {
  const root = path.resolve("json-validation-fixture");
  const file = path.join(root, "record.yaml");
  const fileSystem = createMemoryFileSystem({
    [file]:
      'version: "11.0"\nkind: network-device\nname: router\nroles: [router]\nimplementation: physical\n',
  });
  const write = jest.fn();
  const error = jest.fn();
  expect(validateInventory([file, "--format", "json"], { write, error, fileSystem })).toBe(0);
  expect(write).toHaveBeenCalledTimes(1);
  expect(JSON.parse(write.mock.calls[0][0])).toEqual({
    status: "passed",
    summary: { files: 1, errors: 0 },
    diagnostics: [],
  });
  expect(error).not.toHaveBeenCalled();
});

test("writes schema and cross-file diagnostics as JSON", () => {
  const root = path.resolve("json-errors-fixture");
  const fileSystem = createMemoryFileSystem({
    [path.join(root, "schema.yaml")]:
      'version: "11.0"\nkind: network-device\nname: invalid\nroles: [unknown]\nimplementation: physical\n',
    [path.join(root, "first.yaml")]:
      'version: "11.0"\nkind: network-device\nid: 7\nname: first\nroles: [router]\nimplementation: physical\n',
    [path.join(root, "second.yaml")]:
      'version: "11.0"\nkind: network-device\nid: 7\nname: second\nroles: [router]\nimplementation: physical\n',
  });
  const write = jest.fn();
  const error = jest.fn();
  expect(validateInventory([root, "--format", "json"], { write, error, fileSystem })).toBe(1);
  const output = JSON.parse(write.mock.calls[0][0]);
  expect(output.status).toBe("failed");
  expect(output.summary).toEqual({ files: 3, errors: 2 });
  expect(output.diagnostics).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        code: "NETDOC_SCHEMA_VALIDATION",
        file: "json-errors-fixture/schema.yaml",
      }),
      expect.objectContaining({
        code: "NETDOC_IDENTIFIER_DUPLICATE",
        file: "json-errors-fixture/second.yaml",
        pointer: "/id",
      }),
    ]),
  );
  expect(error).not.toHaveBeenCalled();
});

test("writes malformed YAML errors as JSON", () => {
  const root = path.resolve("json-yaml-error-fixture");
  const file = path.join(root, "broken.yaml");
  const fileSystem = createMemoryFileSystem({ [file]: "name: [broken\n" });
  const write = jest.fn();
  const error = jest.fn();
  expect(validateInventory([file, "--format", "json"], { write, error, fileSystem })).toBe(1);
  const output = JSON.parse(write.mock.calls[0][0]);
  expect(output.status).toBe("failed");
  expect(output.diagnostics[0]).toMatchObject({
    code: "NETDOC_YAML_PARSE_ERROR",
    file: "json-yaml-error-fixture/broken.yaml",
    pointer: "",
  });
  expect(error).not.toHaveBeenCalled();
});

test("returns a JSON error for invalid JSON-mode arguments", () => {
  const write = jest.fn();
  const error = jest.fn();
  expect(validateInventory(["--format", "json"], { write, error })).toBe(2);
  expect(JSON.parse(write.mock.calls[0][0])).toMatchObject({
    status: "error",
    error: { code: "NETDOC_ARGUMENTS_INVALID" },
  });
  expect(error).not.toHaveBeenCalled();
});

test("uses default output for invalid JSON-mode arguments", () => {
  const write = jest.spyOn(console, "log").mockImplementation(() => {});
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(validateInventory(["--format", "json"])).toBe(2);
  expect(JSON.parse(write.mock.calls[0][0])).toMatchObject({
    status: "error",
    error: { code: "NETDOC_ARGUMENTS_INVALID" },
  });
  expect(error).not.toHaveBeenCalled();
  write.mockRestore();
  error.mockRestore();
});

test("uses default output for invalid arguments and JSON setup errors", () => {
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(validateInventory([])).toBe(2);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("Usage: netdoc validate"));
  error.mockRestore();

  const write = jest.spyOn(console, "log").mockImplementation(() => {});
  const jsonError = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(validateInventory(["missing-json-target", "--format", "json"])).toBe(2);
  expect(JSON.parse(write.mock.calls[0][0])).toMatchObject({
    status: "error",
    error: { code: "NETDOC_SETUP_ERROR" },
  });
  expect(jsonError).not.toHaveBeenCalled();
  write.mockRestore();
  jsonError.mockRestore();
});
