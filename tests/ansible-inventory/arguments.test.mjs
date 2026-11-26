import { expect, test } from "@jest/globals";
import parseArguments from "../../src/ansible-inventory/arguments.mjs";

test("parses inventory list and host requests", () => {
  expect(parseArguments(["inventory", "--list"])).toEqual({ mode: "list" });
  expect(parseArguments(["inventory", "--host", "nas"])).toEqual({
    mode: "host",
    hostname: "nas",
  });
});

test.each([
  { args: [] },
  { args: ["inventory"] },
  { args: ["inventory", "--list", "extra"] },
  { args: ["inventory", "--host"] },
  { args: ["inventory", "--host", ""] },
  { args: ["inventory", "--host", "nas", "extra"] },
  { args: ["unknown", "--list"] },
])("rejects invalid Ansible inventory arguments $args", ({ args }) => {
  expect(parseArguments(args)).toEqual({
    error: "Usage: netdoc ansible inventory --list | --host <inventory-hostname>",
  });
});
