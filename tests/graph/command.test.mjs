import { expect, jest, test } from "@jest/globals";
import path from "node:path";
import { createMemoryFileSystem } from "../../test-fixtures/memory-file-system.mjs";
import { graphInventory } from "../../src/graph/command.mjs";

test("renders a validated inventory and reports its configured tunnel", () => {
  const root = path.resolve("graph-command-fixture");
  const fileSystem = createMemoryFileSystem({
    [path.join(root, "router.yaml")]:
      'version: "11.0"\nkind: network-device\nid: 1\nname: router\nroles: [router]\nimplementation: physical\ninterfaces:\n  - id: 11\n    name: eth0\n    type: ethernet\n    segmentId: 100\n    connectsTo: 22\n    addresses:\n      - cidr: 192.0.2.1/24\n        assignment: static\n  - id: 12\n    name: eth1\n    type: ethernet\n    segmentId: 101\nnetworking:\n  tunnels:\n    - type: wireguard\n      listenPort: 51820\n',
    [path.join(root, "server.yaml")]:
      'version: "11.0"\nkind: physical-machine\nid: 2\nname: server\nroles: [server]\ninterfaces:\n  - id: 22\n    name: eth0\n    type: ethernet\n    segmentId: 100\n    connectsTo: 11\n    addresses:\n      - cidr: 192.0.2.2/24\n        assignment: static\n',
    [path.join(root, "segment-home.yaml")]:
      'version: "11.0"\nkind: network-segment\nid: 100\nname: Home LAN\nmedium: ethernet\nvlan: untagged\nipNetworks:\n  - cidr: 192.0.2.0/24\n',
    [path.join(root, "segment-guest.yaml")]:
      'version: "11.0"\nkind: network-segment\nid: 101\nname: Guest VLAN\nmedium: ethernet\nvlan: 10\n',
  });
  const write = jest.spyOn(console, "log").mockImplementation(() => {});
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(graphInventory([root, "--format", "mermaid"], { fileSystem })).toBe(0);
  expect(write.mock.calls[0][0]).toContain('object_0["network-device<br/>router"]');
  expect(write.mock.calls[0][0]).toContain(
    'object_1["network-segment<br/>Guest VLAN<br/>VLAN: 10"]',
  );
  expect(write.mock.calls[0][0]).toContain("eth0 ↔ eth0");
  expect(write.mock.calls[0][0]).toContain("Configured wireguard");
  expect(error).not.toHaveBeenCalled();
  write.mockRestore();
  error.mockRestore();
});

test("reports invalid references and does not print a partial graph", () => {
  const root = path.resolve("graph-error-fixture");
  const file = path.join(root, "router.yaml");
  const fileSystem = createMemoryFileSystem({
    [file]:
      'version: "11.0"\nkind: network-device\nname: router\nroles: [router]\nimplementation: physical\ninterfaces:\n  - name: eth0\n    type: ethernet\n    segmentId: 99\n',
  });
  const write = jest.fn();
  const error = jest.fn();
  expect(graphInventory([root, "--format", "mermaid"], { fileSystem, write, error })).toBe(1);
  expect(write).not.toHaveBeenCalled();
  expect(error).toHaveBeenCalledWith(
    expect.stringContaining(
      `${path.join("graph-error-fixture", "router.yaml")}#/interfaces/0/segmentId`,
    ),
  );
});

test("rejects unsupported graph options", () => {
  const error = jest.fn();
  expect(graphInventory(["inventory", "--format", "json"], { error })).toBe(2);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("Usage: netdoc graph"));
});

test("reports missing paths with the default error output", () => {
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(graphInventory(["missing-graph-path", "--format", "mermaid"])).toBe(2);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("Path does not exist"));
  error.mockRestore();
});
