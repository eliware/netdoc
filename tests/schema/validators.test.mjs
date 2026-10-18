import { beforeAll, expect, test } from "@jest/globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadSchemaValidators, tryLoadSchemaValidators } from "../../src/schema/validators.mjs";

const root = fileURLToPath(new URL("../../specs/schema/", import.meta.url));
let validators;

beforeAll(() => {
  validators = loadSchemaValidators(root);
});

test("loads a schema validator for each supported object kind", () => {
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

test("validates switch ports and network configuration", () => {
  const validate = validators["network-device"];
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

test("validates network interface fields and constraints", () => {
  const validate = validators["network-device"];
  const base = {
    version: "11.0",
    kind: "network-device",
    name: "router",
    roles: ["router"],
    implementation: "physical",
  };
  const invalidInterfaces = [
    { name: "eth0", type: "invalid" },
    { name: "eth0", type: "ethernet", extra: true },
    {
      name: "eth0",
      type: "ethernet",
      addresses: [{ assignment: "static", cidr: "192.0.2.1/24" }],
    },
    { name: "eth0", type: "ethernet", connectsTo: 8 },
    { name: "eth0", type: "ethernet", id: 7, connectsTo: 8, unused: true },
  ];
  for (const networkInterface of invalidInterfaces)
    expect(validate({ ...base, interfaces: [networkInterface] })).toBe(false);
  expect(
    validate({
      ...base,
      interfaces: [
        {
          name: "eth0",
          type: "ethernet",
          macAddress: "00:11:22:33:44:55",
          segmentId: 4,
          addresses: [{ assignment: "static", cidr: "192.0.2.1/24" }],
        },
      ],
    }),
  ).toBe(true);
});

test("accepts hardware and storage definitions", () => {
  const validate = validators["physical-machine"];
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

test("returns schema load errors for the validation workflow", () => {
  expect(tryLoadSchemaValidators(path.join(root, "missing"))).toEqual({
    error: expect.stringContaining("Could not load schemas:"),
  });
});
