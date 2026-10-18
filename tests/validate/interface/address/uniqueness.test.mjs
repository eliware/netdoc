import { expect, test } from "@jest/globals";
import { validateInterfaceAddressUniqueness } from "../../../../src/validate/interface/address/uniqueness.mjs";

test("finds repeated assigned addresses on the same segment", () => {
  const assignments = new Map();
  const parsed = { version: 4, bits: 32, prefix: 32, integer: 3221225985n };
  const networkInterface = { segmentId: 2n };
  const addressAssignment = { assignment: "static" };
  const first = { file: "first.yaml", data: { id: 1n } };
  const second = { file: "second.yaml", data: { id: 2n } };
  expect(
    validateInterfaceAddressUniqueness(
      networkInterface,
      addressAssignment,
      parsed,
      "192.0.2.1",
      first,
      "/interfaces/0/addresses/0/cidr",
      assignments,
    ),
  ).toEqual([]);
  expect(
    validateInterfaceAddressUniqueness(
      networkInterface,
      addressAssignment,
      parsed,
      "192.0.2.1",
      second,
      "/interfaces/0/addresses/0/cidr",
      assignments,
    )[0].message,
  ).toContain("is in use at first.yaml");
});

test.each([
  [{ segmentId: 2n }, { assignment: "virtual" }],
  [{}, { assignment: "static" }],
])("skips shared or unsegmented addresses", (networkInterface, addressAssignment) => {
  expect(
    validateInterfaceAddressUniqueness(
      networkInterface,
      addressAssignment,
      { version: 4, bits: 32, prefix: 32, integer: 1n },
      "192.0.2.1",
      { file: "node.yaml", data: { id: 1n } },
      "/interfaces/0/addresses/0/cidr",
      new Map(),
    ),
  ).toEqual([]);
});

test("checks DHCP reservations for duplicate addresses", () => {
  const assignments = new Map();
  const args = [
    { segmentId: 2n },
    { assignment: "dhcp-reservation" },
    { version: 4, bits: 32, prefix: 32, integer: 1n },
    "192.0.2.1",
    { file: "node.yaml", data: { id: 1n } },
    "/interfaces/0/addresses/0/cidr",
    assignments,
  ];
  validateInterfaceAddressUniqueness(...args);
  expect(validateInterfaceAddressUniqueness(...args)[0].message).toContain("is in use");
});

test("allows a DHCP lease that matches its MAC reservation", () => {
  const assignments = new Map();
  const address = { version: 4, bits: 32, prefix: 32, integer: 1n };
  const macAddress = "AA-BB-CC-DD-EE-FF";
  const networkInterface = { segmentId: 2n, macAddress };
  const record = { file: "node.yaml", data: { id: 1n } };
  validateInterfaceAddressUniqueness(
    networkInterface,
    { assignment: "dhcp" },
    address,
    "192.0.2.1",
    record,
    "/interfaces/0/addresses/0/cidr",
    assignments,
  );
  expect(
    validateInterfaceAddressUniqueness(
      { ...networkInterface, macAddress: "aa:bb:cc:dd:ee:ff" },
      { assignment: "dhcp-reservation" },
      address,
      "192.0.2.1",
      record,
      "/interfaces/0/addresses/1/cidr",
      assignments,
    ),
  ).toEqual([]);
});

test("finds overlapping network prefixes on the same segment", () => {
  const assignments = new Map();
  const first = { file: "first.yaml", data: { id: 1n } };
  const second = { file: "second.yaml", data: { id: 2n } };
  validateInterfaceAddressUniqueness(
    { segmentId: 2n },
    { assignment: "static" },
    { version: 4, bits: 32, prefix: 24, integer: 3221225984n },
    "192.0.2.0/24",
    first,
    "/interfaces/0/addresses/0/cidr",
    assignments,
  );
  expect(
    validateInterfaceAddressUniqueness(
      { segmentId: 2n },
      { assignment: "static" },
      { version: 4, bits: 32, prefix: 25, integer: 3221226112n },
      "192.0.2.128/25",
      second,
      "/interfaces/0/addresses/0/cidr",
      assignments,
    )[0].message,
  ).toContain("is in use at first.yaml");
});

test("allows different host addresses inside the same subnet", () => {
  const assignments = new Map();
  const record = { file: "node.yaml", data: { id: 1n } };
  validateInterfaceAddressUniqueness(
    { segmentId: 2n },
    { assignment: "static" },
    { version: 4, bits: 32, prefix: 24, integer: 3221225985n },
    "192.0.2.1/24",
    record,
    "/interfaces/0/addresses/0/cidr",
    assignments,
  );
  expect(
    validateInterfaceAddressUniqueness(
      { segmentId: 2n },
      { assignment: "static" },
      { version: 4, bits: 32, prefix: 24, integer: 3221225986n },
      "192.0.2.2/24",
      record,
      "/interfaces/1/addresses/0/cidr",
      assignments,
    ),
  ).toEqual([]);
});

test("reports a DHCP lease that matches a different MAC reservation", () => {
  const assignments = new Map();
  const address = { version: 4, bits: 32, prefix: 32, integer: 1n };
  const record = { file: "node.yaml", data: { id: 1n } };
  validateInterfaceAddressUniqueness(
    { segmentId: 2n, macAddress: "AA:BB:CC:DD:EE:FF" },
    { assignment: "dhcp" },
    address,
    "192.0.2.1",
    record,
    "/interfaces/0/addresses/0/cidr",
    assignments,
  );
  expect(
    validateInterfaceAddressUniqueness(
      { segmentId: 2n, macAddress: "11:22:33:44:55:66" },
      { assignment: "dhcp-reservation" },
      address,
      "192.0.2.1",
      record,
      "/interfaces/1/addresses/0/cidr",
      assignments,
    )[0].message,
  ).toContain("is in use");
});
