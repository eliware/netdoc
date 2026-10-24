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

test("checks valid records when a record has a schema error", () => {
  const fileSystem = createInventory({
    "broken.yaml":
      'version: "11.0"\nkind: network-device\nname: broken\nroles: [unknown]\nimplementation: physical\n',
    "router.yaml":
      'version: "11.0"\nkind: network-device\nname: router\nroles: [router]\nimplementation: physical\ninterfaces:\n  - name: eth0\n    type: ethernet\n    segmentId: 99\n',
  });
  const error = jest.fn();
  expect(validateTarget(root, { error, fileSystem })).toBe(1);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("allowed values"));
  expect(error).toHaveBeenCalledWith(
    expect.stringContaining("Reference 99 does not resolve to a network-segment."),
  );
});

test("checks record values when IDs conflict", () => {
  const fileSystem = createInventory({
    "first.yaml":
      'version: "11.0"\nkind: network-device\nid: 7\nname: first\nroles: [router]\nimplementation: physical\nnetworking:\n  routing:\n    defaultGateway: bad\n',
    "second.yaml":
      'version: "11.0"\nkind: network-device\nid: 7\nname: second\nroles: [router]\nimplementation: physical\n',
  });
  const error = jest.fn();
  expect(validateTarget(root, { error, fileSystem })).toBe(1);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("is in use"));
  expect(error).toHaveBeenCalledWith(
    expect.stringContaining("Invalid IP address or network 'bad'."),
  );
});

test("validates the wireless and DNS inventory fixtures", () => {
  const fixtureDirectory = fileURLToPath(
    new URL("../test-fixtures/wireless-inventory/", import.meta.url),
  );
  const write = jest.fn();
  const error = jest.fn();
  expect(validateTarget(fixtureDirectory, { write, error })).toBe(0);
  expect(write).toHaveBeenCalledWith("Validated 12 YAML file(s).");
  expect(error).not.toHaveBeenCalled();
});

test("validates switch ports and network configuration together", () => {
  const router = {
    version: "11.0",
    kind: "network-device",
    name: "router",
    roles: ["router", "switch"],
    implementation: "physical",
    interfaces: [
      { name: "LAN1", type: "ethernet", segmentId: 101 },
      { name: "LAN bridge", type: "bridge", segmentId: 101 },
      {
        name: "VLAN 102",
        type: "vlan",
        parentInterface: "LAN bridge",
        segmentId: 102,
        addresses: [{ cidr: "192.0.2.1/24", assignment: "static" }],
      },
      { name: "uplink", type: "ethernet" },
    ],
    switch: {
      management: "managed",
      ports: [
        { interfaceName: "LAN1", type: "physical", mode: "access", segmentId: 101 },
        { interfaceName: "LAN bridge", type: "internal", mode: "access", segmentId: 101 },
        {
          interfaceName: "uplink",
          type: "physical",
          mode: "trunk",
          segmentIds: [102, 103],
          pvidSegmentId: 101,
        },
      ],
    },
    networking: {
      routing: {
        staticRoutes: [{ destination: "0.0.0.0/0", nextHop: "192.0.2.254" }],
        bgp: { localAs: 64512, routerId: "192.0.2.1" },
      },
      tunnels: [{ type: "wireguard", peers: [{ endpointAddress: "198.51.100.1" }] }],
      firewall: { defaultAction: "drop", rules: [{ action: "allow", source: "any" }] },
      nat: { rules: [{ type: "source", translation: "masquerade" }] },
      dhcp: { scopes: [{ network: "192.0.2.0/24" }] },
    },
  };
  const segment = (id, vlan, ipNetworks = []) => ({
    version: "11.0",
    kind: "network-segment",
    id,
    name: `segment-${id}`,
    medium: "ethernet",
    vlan,
    ipNetworks,
  });
  const fileSystem = createInventory({
    "router.yaml": JSON.stringify(router),
    "segment-101.yaml": JSON.stringify(segment(101, "untagged")),
    "segment-102.yaml": JSON.stringify(
      segment(102, 102, [{ cidr: "192.0.2.0/24", gateway: "192.0.2.254" }]),
    ),
    "segment-103.yaml": JSON.stringify(segment(103, 103)),
  });
  const write = jest.fn();
  const error = jest.fn();

  expect(validateTarget(root, { write, error, fileSystem })).toBe(0);
  expect(error).not.toHaveBeenCalled();
});
