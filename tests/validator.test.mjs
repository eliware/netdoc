import { afterEach, expect, test, jest } from "@jest/globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createMemoryFileSystem } from "../test-fixtures/memory-file-system.mjs";
import { validateTarget } from "../src/validator.mjs";

const root = path.resolve("validation-fixture");
const validRecord =
  'version: "11.0"\nkind: network-device\nname: router\nroles: [router]\nimplementation: physical\n';

afterEach(() => jest.restoreAllMocks());

function createInventory(records, emptyDirectories = []) {
  const files = Object.fromEntries(
    Object.entries(records).map(([name, content]) => [path.join(root, name), content]),
  );
  return createMemoryFileSystem(files, emptyDirectories);
}

test("uses default validation settings for a valid file", () => {
  const file = path.join(root, "record.yaml");
  const fileSystem = createInventory({ "record.yaml": validRecord });
  const write = jest.spyOn(console, "log").mockImplementation(() => {});
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(validateTarget(file, { fileSystem })).toBe(0);
  expect(write).toHaveBeenCalledWith("Validated 1 YAML file(s).");
  expect(error).not.toHaveBeenCalled();
});

test("reports target setup errors", () => {
  const file = path.join(root, "record.yaml");
  const empty = path.join(root, "empty");
  const fileSystem = createInventory({ "record.yaml": validRecord }, [empty]);
  const error = jest.fn();
  expect(validateTarget("missing", { cwd: root, error, fileSystem })).toBe(2);
  expect(validateTarget(undefined, { error, fileSystem })).toBe(2);
  expect(validateTarget("", { error, fileSystem })).toBe(2);
  expect(
    validateTarget(file, { schemaDirectory: path.join(root, "schemas"), error, fileSystem }),
  ).toBe(2);
  expect(validateTarget(empty, { error, fileSystem })).toBe(2);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("Path does not exist:"));
  expect(error).toHaveBeenCalledWith(expect.stringContaining("No YAML files found:"));
  expect(error).toHaveBeenCalledWith(expect.stringContaining("Could not load schemas:"));
});

test("uses default output and working directory settings", () => {
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(validateTarget("")).toBe(2);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("Path does not exist:"));
});

test("reports YAML parse errors", () => {
  const fileSystem = createInventory({ "bad.yaml": "name: [broken\n" });
  const error = jest.fn();
  expect(validateTarget(root, { error, fileSystem })).toBe(1);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("YAML parse error:"));
});

test("reports unsupported object types and schema violations", () => {
  const fileSystem = createInventory({
    "kind.yaml": "name: unknown\n",
    "unsupported.yaml": 'version: "11.0"\nkind: unknown\nname: unknown\n',
    "scalar.yaml": "just text\n",
    "null.yaml": "null\n",
    "schema.yaml":
      'version: "11.0"\nkind: network-device\nname: bad\nroles: [unknown]\nimplementation: physical\n',
    "required.yaml": 'version: "11.0"\nkind: network-device\nname: broken\n',
  });
  const error = jest.fn();
  expect(validateTarget(root, { error, fileSystem })).toBe(1);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("Missing or unsupported object type"));
  expect(error).toHaveBeenCalledWith(
    expect.stringContaining("must be equal to one of the allowed values"),
  );
  expect(error).toHaveBeenCalledWith(expect.stringContaining("required.yaml:"));
  expect(error).toHaveBeenCalledWith(expect.stringContaining("Found "));
});

test("rejects integer values that exceed safe numeric precision", () => {
  const fileSystem = createInventory({
    "large-size.yaml":
      'version: "11.0"\nkind: physical-machine\nname: large\nroles: [server]\nhardware:\n  memory:\n    capacity:\n      value: 9007199254740993\n      unit: B\n',
  });
  const error = jest.fn();
  expect(validateTarget(root, { error, fileSystem })).toBe(1);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("/hardware/memory/capacity/value"));
});

test("validates wireless controller references with full 64-bit IDs", () => {
  const controllerId = 9223372036854775807n;
  const accessPoint = `version: "11.0"\nkind: network-device\nname: access point\nroles: [wireless-access-point]\nimplementation: physical\nwirelessManagement:\n  state: managed\n  controllerId: ${controllerId}\n`;
  const controller = (roles) =>
    `version: "11.0"\nkind: virtual-machine\nid: ${controllerId}\nname: controller\nresidentOn: 99\nroles: ${roles}\n`;
  const host =
    'version: "11.0"\nkind: physical-machine\nid: 99\nname: hypervisor\nroles: [hypervisor]\n';
  const error = jest.fn();
  const write = jest.fn();

  expect(
    validateTarget(root, {
      error,
      write,
      fileSystem: createInventory({
        "ap.yaml": accessPoint,
        "controller.yaml": controller("[wireless-controller]"),
        "host.yaml": host,
      }),
    }),
  ).toBe(0);
  expect(
    validateTarget(root, {
      error,
      write,
      fileSystem: createInventory({
        "ap.yaml": accessPoint,
        "controller.yaml": controller("[host]"),
        "host.yaml": host,
      }),
    }),
  ).toBe(1);
  expect(error).toHaveBeenCalledWith(
    expect.stringContaining("does not have the 'wireless-controller' role"),
  );
  error.mockClear();
  expect(
    validateTarget(root, { error, write, fileSystem: createInventory({ "ap.yaml": accessPoint }) }),
  ).toBe(1);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("resolves to no object"));
});

test("validates the generated 64-bit wireless controller fixture", () => {
  const fixtureDirectory = fileURLToPath(
    new URL("../test-fixtures/wireless-controller-64-bit/", import.meta.url),
  );
  const write = jest.fn();
  const error = jest.fn();

  expect(validateTarget(fixtureDirectory, { write, error })).toBe(0);
  expect(write).toHaveBeenCalledWith("Validated 3 YAML file(s).");
  expect(error).not.toHaveBeenCalled();
});

test("accepts mixed WPA2 and WPA3 personal and enterprise modes", () => {
  const fileSystem = createInventory({
    "personal.yaml":
      'version: "11.0"\nkind: wireless-network\nid: 1\nname: Personal Wi-Fi\nssid: personal\nsecurity:\n  mode: wpa2-wpa3-personal\n',
    "enterprise.yaml":
      'version: "11.0"\nkind: wireless-network\nid: 2\nname: Enterprise Wi-Fi\nssid: enterprise\nsecurity:\n  mode: wpa2-wpa3-enterprise\n',
  });
  const error = jest.fn();
  const write = jest.fn();

  expect(validateTarget(root, { error, write, fileSystem })).toBe(0);
  expect(error).not.toHaveBeenCalled();
});

test("rejects VXLAN values outside the schema range", () => {
  const fileSystem = createInventory({
    "overlay.yaml":
      'version: "11.0"\nkind: network-segment\nid: 1\nname: overlay\nmedium: virtual\nvlan: untagged\nencapsulation:\n  type: vxlan\n  underlaySegmentId: 2\n  vni: 16777216\n',
  });
  const error = jest.fn();

  expect(validateTarget(root, { error, fileSystem })).toBe(1);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("/encapsulation/vni"));
});
