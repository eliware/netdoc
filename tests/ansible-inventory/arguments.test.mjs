import { expect, test } from "@jest/globals";
import parseArguments from "../../src/ansible-inventory/arguments.mjs";

test("parses inventory list and host requests", () => {
  expect(parseArguments(["inventory", "--list"])).toEqual({
    inventoryPath: "inventory",
    mode: "list",
  });
  expect(parseArguments(["inventory", "--host", "nas"])).toEqual({
    inventoryPath: "inventory",
    mode: "host",
    hostname: "nas",
  });
});

test.each([
  { args: [] },
  { args: ["", "--list"] },
  { args: ["inventory"] },
  { args: ["inventory", "--list", "extra"] },
  { args: ["inventory", "--host"] },
  { args: ["inventory", "--host", ""] },
  { args: ["inventory", "--host", "nas", "extra"] },
])("rejects invalid Ansible inventory arguments $args", ({ args }) => {
  expect(parseArguments(args)).toEqual({
    error: "Usage: netdoc ansible <path> (--list | --host <inventory-hostname>)",
  });
});
