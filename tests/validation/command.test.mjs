import { expect, test, jest } from "@jest/globals";
import path from "node:path";
import { createMemoryFileSystem } from "../../test-fixtures/memory-file-system.mjs";
import { validateInventory } from "../../src/validation/command.mjs";

test("stops when validation arguments are invalid", () => {
  const error = jest.fn();
  expect(validateInventory([], { error })).toBe(2);
  expect(error).toHaveBeenCalledWith("Usage: netdoc validate <yaml-file-or-directory>");
});

test("uses the default error output", () => {
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(validateInventory([])).toBe(2);
  expect(error).toHaveBeenCalledWith("Usage: netdoc validate <yaml-file-or-directory>");
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
