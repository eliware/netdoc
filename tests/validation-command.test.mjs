import { afterEach, expect, test, jest } from "@jest/globals";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { validateInventory } from "../src/validation-command.mjs";

let directory;
afterEach(() => {
  if (directory) fs.rmSync(directory, { recursive: true, force: true });
  directory = undefined;
  jest.restoreAllMocks();
});

test("stops when validation arguments are invalid", () => {
  const error = jest.fn();
  expect(validateInventory([], { error })).toBe(2);
  expect(error).toHaveBeenCalledWith("Usage: netdoc validate <yaml-file-or-directory>");
});

test("sends the valid path to the inventory validator", () => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), "netdoc-command-"));
  const file = path.join(directory, "record.yaml");
  fs.writeFileSync(
    file,
    'version: "11.0"\nkind: network-device\nname: router\nroles: [router]\nimplementation: physical\n',
  );
  const write = jest.fn();
  const error = jest.fn();
  expect(validateInventory([file], { write, error })).toBe(0);
  expect(write).toHaveBeenCalledWith("Validated 1 YAML file(s).");
  expect(error).not.toHaveBeenCalled();
  const log = jest.spyOn(console, "log").mockImplementation(() => {});
  const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(validateInventory([file])).toBe(0);
  expect(log).toHaveBeenCalledWith("Validated 1 YAML file(s).");
  expect(consoleError).not.toHaveBeenCalled();
});
