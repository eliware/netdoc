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
