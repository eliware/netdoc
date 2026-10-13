import { expect, test } from "@jest/globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadSchemaValidators } from "../src/schema-validators.mjs";

const root = fileURLToPath(new URL("../specs/schema/", import.meta.url));

test("loads a schema validator for each supported object kind", () => {
  const validators = loadSchemaValidators(root);
  expect(Object.keys(validators).sort()).toEqual([
    "network-device",
    "network-segment",
    "physical-machine",
    "virtual-machine",
  ]);
  expect(
    validators["network-device"]({
      version: "11.0",
      kind: "network-device",
      name: "router",
      roles: ["router"],
      implementation: "physical",
    }),
  ).toBe(true);
});

test("accepts switch ports with access, trunk, and internal router links", () => {
  const validate = loadSchemaValidators(root)["network-device"];
  expect(
    validate({
      version: "11.0",
      kind: "network-device",
      name: "router",
      roles: ["router", "switch"],
      implementation: "physical",
      interfaces: [
        { name: "LAN1", type: "ethernet" },
        { name: "LAN bridge", type: "bridge" },
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
    }),
  ).toBe(true);
});

test("rejects invalid switch access and trunk port membership", () => {
  const validate = loadSchemaValidators(root)["network-device"];
  expect(
    validate({
      version: "11.0",
      kind: "network-device",
      name: "router",
      roles: ["router"],
      implementation: "physical",
      switch: {
        management: "unmanaged",
        ports: [
          { interfaceName: "LAN1", type: "physical", mode: "access" },
          { interfaceName: "LAN2", type: "physical", mode: "trunk", segmentId: 101 },
        ],
      },
    }),
  ).toBe(false);
});

test("accepts network configuration and rejects invalid routing values", () => {
  const validate = loadSchemaValidators(root)["network-device"];
  const record = {
    version: "11.0",
    kind: "network-device",
    name: "router",
    roles: ["router"],
    implementation: "physical",
  };
  expect(
    validate({
      ...record,
      networking: {
        routing: {
          staticRoutes: [{ destination: "0.0.0.0/0", nextHop: "192.0.2.1" }],
          bgp: { localAs: 64512, routerId: "192.0.2.1" },
        },
        tunnels: [{ type: "wireguard", peers: [{ endpointAddress: "198.51.100.1" }] }],
        firewall: { defaultAction: "drop", rules: [{ action: "allow", source: "any" }] },
        nat: { rules: [{ type: "source", translation: "masquerade" }] },
        dhcp: { scopes: [{ network: "192.0.2.0/24" }] },
      },
    }),
  ).toBe(true);
  expect(validate({ ...record, networking: { routing: { bgp: { localAs: 0 } } } })).toBe(false);
  expect(
    validate({ ...record, networking: { routing: { staticRoutes: [{ destination: "bad" }] } } }),
  ).toBe(false);
});

test("accepts hardware and storage definitions", () => {
  const validate = loadSchemaValidators(root)["physical-machine"];
  expect(
    validate({
      version: "11.0",
      kind: "physical-machine",
      name: "host",
      roles: ["hypervisor"],
      hardware: {
        manufacturer: "Example",
        cpu: { model: "CPU", cores: 8, baseClock: { value: 3.2, unit: "GHz" } },
        memory: { capacity: { value: 32, unit: "GiB" } },
      },
      storage: { devices: [{ device: "/dev/sda", capacity: { value: 1, unit: "TB" } }] },
    }),
  ).toBe(true);
  expect(
    validate({
      version: "11.0",
      kind: "physical-machine",
      name: "host",
      roles: ["hypervisor"],
      hardware: { memory: { capacity: { value: 0, unit: "GB" } } },
    }),
  ).toBe(false);
});

test("reports a missing schema file through a load error", () => {
  expect(() => loadSchemaValidators(path.join(root, "missing"))).toThrow();
});
