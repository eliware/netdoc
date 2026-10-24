import { beforeAll, expect, test } from "@jest/globals";
import { fileURLToPath } from "node:url";
import { loadSchemaValidators } from "../../src/schema/validators.mjs";

const root = fileURLToPath(new URL("../../specs/schema/", import.meta.url));
let validators;
const networkDevice = {
  version: "11.0",
  kind: "network-device",
  name: "router",
  lastReviewed: "2026-10-24",
  roles: ["router"],
  implementation: "physical",
};

const validateInterface = (networkInterface) =>
  validators["network-device"]({ ...networkDevice, interfaces: [networkInterface] });

beforeAll(() => {
  validators = loadSchemaValidators(root);
});

test("loads the supported validators and validates network interfaces", () => {
  expect(Object.keys(validators).sort()).toEqual([
    "network-device",
    "network-segment",
    "physical-machine",
    "virtual-machine",
    "wireless-network",
  ]);
  expect(validators["network-device"](networkDevice)).toBe(true);
  const validate = validators["network-device"];
  const invalidInterfaces = [
    { name: "eth0", type: "invalid" },
    { name: "Wi-Fi", type: "wireless" },
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
    expect(validate({ ...networkDevice, interfaces: [networkInterface] })).toBe(false);
  expect(
    validateInterface({
      name: "eth0",
      type: "ethernet",
      macAddress: "00:11:22:33:44:55",
      segmentId: 4,
      addresses: [{ assignment: "static", cidr: "192.0.2.1/24" }],
    }),
  ).toBe(true);
});

test("validates configured MTU values on every supported interface type", () => {
  const validate = (mtu, type = "ethernet") =>
    validateInterface({
      name: "if0",
      type,
      ...(mtu === undefined ? {} : { mtu }),
      ...(type === "wireless"
        ? { wireless: { role: "client", profiles: [{ wirelessNetworkId: 1 }] } }
        : {}),
    });
  for (const type of [
    "ethernet",
    "wireless",
    "virtual-ethernet",
    "tunnel",
    "loopback",
    "bridge",
    "vlan",
    "other",
  ])
    expect(validate(1500, type)).toBe(true);
  for (const mtu of [0, -1, 1.5, 4294967296, "1500", null]) expect(validate(mtu)).toBe(false);
  for (const mtu of [1, 1500, 9000, 4294967295]) expect(validate(mtu)).toBe(true);
  expect(validate()).toBe(true);
});

test("accepts hardware and storage definitions", () => {
  const validate = validators["physical-machine"];
  expect(
    validate({
      version: "11.0",
      kind: "physical-machine",
      name: "host",
      lastReviewed: "2026-10-24",
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
      lastReviewed: "2026-10-24",
      roles: ["hypervisor"],
      hardware: { memory: { capacity: { value: 0, unit: "GB" } } },
    }),
  ).toBe(false);
});

test("validates wireless network records and security modes", () => {
  const validate = validators["wireless-network"];
  for (const mode of [
    "open",
    "wpa2-personal",
    "wpa3-personal",
    "wpa2-enterprise",
    "wpa3-enterprise",
    "unknown",
  ]) {
    expect(
      validate({
        version: "11.0",
        kind: "wireless-network",
        id: 1,
        name: "Home Wi-Fi",
        lastReviewed: "2026-10-24",
        ssid: "private5",
        security: { mode },
      }),
    ).toBe(true);
  }
  expect(validate({ version: "11.0", kind: "wireless-network", name: "Wi-Fi", ssid: "home" })).toBe(
    false,
  );
  expect(
    validate({
      version: "11.0",
      kind: "wireless-network",
      id: 1,
      name: "Wi-Fi",
      lastReviewed: "2026-10-24",
      ssid: "home",
      security: { mode: "wpa2-personal", password: "not-used" },
    }),
  ).toBe(false);
});

test("validates wireless radios, client profiles, management, and DNS names", () => {
  const validateDevice = validators["network-device"];
  const validateMachine = validators["physical-machine"];
  const validateDeviceRecord = {
    version: "11.0",
    kind: "network-device",
    name: "Access point",
    lastReviewed: "2026-10-24",
    roles: ["wireless-access-point"],
    implementation: "physical",
  };
  for (const state of ["managed", "unmanaged", "unknown"])
    expect(validateDevice({ ...validateDeviceRecord, wirelessManagement: { state } })).toBe(true);
  expect(
    validateDevice({
      ...validateDeviceRecord,
      interfaces: [
        {
          name: "5 GHz",
          type: "wireless",
          wireless: {
            role: "radio",
            band: "5 GHz",
            channel: 36,
            channelWidth: "80 MHz",
            broadcasts: [
              { wirelessNetworkId: 10, segmentId: 20, bssid: "00:11:22:33:44:55" },
              { wirelessNetworkId: 11, segmentId: 20, hidden: false },
            ],
          },
        },
      ],
    }),
  ).toBe(true);
  expect(
    validateMachine({
      version: "11.0",
      kind: "physical-machine",
      name: "Phone",
      lastReviewed: "2026-10-24",
      roles: ["mobile-device"],
      interfaces: [
        {
          name: "Wi-Fi",
          type: "wireless",
          addresses: [{ assignment: "static", cidr: "192.0.2.8/24" }],
          wireless: {
            role: "client",
            profiles: [
              { wirelessNetworkId: 10, autoJoin: true, priority: 1 },
              { wirelessNetworkId: 11, accessPointId: 12 },
            ],
          },
        },
      ],
    }),
  ).toBe(true);
  expect(
    validateMachine({
      version: "11.0",
      kind: "physical-machine",
      name: "NAS",
      lastReviewed: "2026-10-24",
      roles: ["storage"],
      interfaces: [
        {
          name: "Ethernet",
          type: "ethernet",
          segmentId: 20,
          addresses: [
            {
              assignment: "static",
              cidr: "192.0.2.5/24",
              dnsNames: ["nas.example.net", "nas-sql.example.net"],
            },
          ],
        },
      ],
    }),
  ).toBe(true);
});

test("rejects invalid wireless interfaces and DNS aliases", () => {
  const validateDevice = validators["network-device"];
  const base = {
    version: "11.0",
    kind: "network-device",
    name: "Access point",
    lastReviewed: "2026-10-24",
    roles: ["wireless-access-point"],
    implementation: "physical",
  };
  for (const wireless of [
    { role: "radio" },
    { role: "radio", broadcasts: [{ wirelessNetworkId: 1 }] },
    { role: "client" },
    { role: "client", profiles: [{ wirelessNetworkId: 1, password: "not-used" }] },
    { role: "invalid" },
  ])
    expect(
      validateDevice({ ...base, interfaces: [{ name: "Wi-Fi", type: "wireless", wireless }] }),
    ).toBe(false);
  expect(validateDevice({ ...base, wirelessManagement: { state: "bad" } })).toBe(false);
  expect(
    validateDevice({
      ...base,
      roles: ["router"],
      wirelessManagement: { state: "unknown" },
    }),
  ).toBe(false);
  const validateMachine = validators["physical-machine"];
  const record = {
    version: "11.0",
    kind: "physical-machine",
    name: "NAS",
    lastReviewed: "2026-10-24",
    roles: ["storage"],
    interfaces: [
      {
        name: "Ethernet",
        type: "ethernet",
        segmentId: 20,
        addresses: [{ assignment: "static", cidr: "192.0.2.5/24", dnsNames: ["nas"] }],
      },
    ],
  };
  expect(validateMachine(record)).toBe(false);
});

test("rejects wireless interfaces that use an inline SSID", () => {
  const base = {
    version: "11.0",
    kind: "network-device",
    name: "Access point",
    lastReviewed: "2026-10-24",
    roles: ["wireless-access-point"],
    implementation: "physical",
  };
  for (const role of ["radio", "client"])
    expect(
      validators["network-device"]({
        ...base,
        interfaces: [{ name: "Wi-Fi", type: "wireless", wireless: { role, ssid: "private5" } }],
      }),
    ).toBe(false);
});
