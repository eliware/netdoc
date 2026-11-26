import { expect, jest, test } from "@jest/globals";
import path from "node:path";
import createDiagnostic from "../src/diagnostics.mjs";
import runAnsibleInventory from "../src/ansible-inventory.mjs";

const records = [
  {
    data: {
      kind: "physical-machine",
      name: "nas",
      username: "root",
      roles: ["storage"],
    },
  },
];

function validateSuccess() {
  return jest.fn(() => ({ exitCode: 0, records }));
}

test("prints a complete JSON inventory for list requests", () => {
  const write = jest.fn();
  const error = jest.fn();
  const validate = validateSuccess();
  expect(
    runAnsibleInventory(["inventory", "--list"], {
      env: { NETDOC_INVENTORY_PATH: "inventory" },
      write,
      error,
      validate,
    }),
  ).toBe(0);
  expect(validate).toHaveBeenCalledWith("inventory");
  expect(JSON.parse(write.mock.calls[0][0])._meta.hostvars.nas.ansible_host).toBe("nas");
  expect(error).not.toHaveBeenCalled();
});

test("prints known host variables and an empty object for an unknown host", () => {
  const write = jest.fn();
  const options = {
    env: { NETDOC_INVENTORY_PATH: "inventory" },
    write,
    error: jest.fn(),
    validate: validateSuccess(),
  };
  expect(runAnsibleInventory(["inventory", "--host", "nas"], options)).toBe(0);
  expect(JSON.parse(write.mock.calls[0][0])).toEqual({
    netdoc_name: "nas",
    netdoc_kind: "physical-machine",
    ansible_host: "nas",
    ansible_user: "root",
    netdoc_roles: ["storage"],
  });
  expect(runAnsibleInventory(["inventory", "--host", "missing"], options)).toBe(0);
  expect(JSON.parse(write.mock.calls[1][0])).toEqual({});
});

test("rejects invalid arguments without loading inventory", () => {
  const error = jest.fn();
  const validate = validateSuccess();
  expect(runAnsibleInventory(["inventory", "--bad"], { error, validate })).toBe(2);
  expect(error).toHaveBeenCalledWith(
    "Usage: netdoc ansible inventory --list | --host <inventory-hostname>",
  );
  expect(validate).not.toHaveBeenCalled();
});

test.each([undefined, "", "   "])("requires a nonempty inventory path %s", (inventoryPath) => {
  const error = jest.fn();
  const validate = validateSuccess();
  expect(
    runAnsibleInventory(["inventory", "--list"], {
      env: { NETDOC_INVENTORY_PATH: inventoryPath },
      error,
      validate,
    }),
  ).toBe(2);
  expect(error).toHaveBeenCalledWith(
    "Set NETDOC_INVENTORY_PATH to a NetDoc YAML file or inventory directory.",
  );
  expect(validate).not.toHaveBeenCalled();
});

test("reports path and setup errors without printing JSON", () => {
  const write = jest.fn();
  const error = jest.fn();
  expect(
    runAnsibleInventory(["inventory", "--list"], {
      env: { NETDOC_INVENTORY_PATH: "missing" },
      write,
      error,
      validate: jest.fn(() => ({ exitCode: 2, error: "Path does not exist: missing" })),
    }),
  ).toBe(2);
  expect(error).toHaveBeenCalledWith("Path does not exist: missing");
  expect(write).not.toHaveBeenCalled();
});

test("reports an incomplete validation result as a setup error", () => {
  const error = jest.fn();
  expect(
    runAnsibleInventory(["inventory", "--list"], {
      env: { NETDOC_INVENTORY_PATH: "inventory" },
      error,
      validate: jest.fn(() => ({ exitCode: 2, diagnostics: [], fileCount: 0 })),
    }),
  ).toBe(2);
  expect(error).toHaveBeenCalledWith("Inventory validation could not complete.");
});

test("uses the default process environment and output handlers", () => {
  const previousPath = process.env.NETDOC_INVENTORY_PATH;
  process.env.NETDOC_INVENTORY_PATH = path.resolve("test-fixtures/wireless-inventory");
  const write = jest.spyOn(console, "log").mockImplementation(() => {});
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  try {
    expect(runAnsibleInventory(["inventory", "--list"])).toBe(0);
    expect(JSON.parse(write.mock.calls[0][0])._meta.hostvars).toBeDefined();
    expect(error).not.toHaveBeenCalled();
  } finally {
    if (previousPath === undefined) delete process.env.NETDOC_INVENTORY_PATH;
    else process.env.NETDOC_INVENTORY_PATH = previousPath;
    write.mockRestore();
    error.mockRestore();
  }
});

test("reports validation errors without printing partial inventory", () => {
  const write = jest.fn();
  const error = jest.fn();
  const diagnostic = createDiagnostic("machine.yaml", "/name", undefined, "Invalid name");
  expect(
    runAnsibleInventory(["inventory", "--list"], {
      env: { NETDOC_INVENTORY_PATH: "inventory" },
      write,
      error,
      validate: jest.fn(() => ({ exitCode: 1, diagnostics: [diagnostic], fileCount: 1 })),
    }),
  ).toBe(1);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("Invalid name"));
  expect(write).not.toHaveBeenCalled();
});

test("reports inventory mapping conflicts as invalid data", () => {
  const write = jest.fn();
  const error = jest.fn();
  const conflictingRecords = [
    { data: { kind: "physical-machine", name: "one", roles: ["Web-App"] } },
    { data: { kind: "physical-machine", name: "two", roles: ["web app"] } },
  ];
  expect(
    runAnsibleInventory(["inventory", "--list"], {
      env: { NETDOC_INVENTORY_PATH: "inventory" },
      write,
      error,
      validate: jest.fn(() => ({ exitCode: 0, records: conflictingRecords })),
    }),
  ).toBe(1);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("same Ansible group name"));
  expect(write).not.toHaveBeenCalled();
});
