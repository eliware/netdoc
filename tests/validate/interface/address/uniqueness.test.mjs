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

test("allows distinct host addresses with the same subnet prefix", () => {
  const assignments = new Map();
  const record = { file: "node.yaml", data: { id: 1n } };
  const networkInterface = { segmentId: 2n };
  const addressAssignment = { assignment: "static" };
  const pointer = "/interfaces/0/addresses/0/cidr";
  expect(
    validateInterfaceAddressUniqueness(
      networkInterface,
      addressAssignment,
      { version: 4, bits: 32, prefix: 24, integer: 3221225985n },
      "192.0.2.1/24",
      record,
      pointer,
      assignments,
    ),
  ).toEqual([]);
  expect(
    validateInterfaceAddressUniqueness(
      networkInterface,
      addressAssignment,
      { version: 4, bits: 32, prefix: 24, integer: 3221225986n },
      "192.0.2.2/24",
      record,
      pointer,
      assignments,
    ),
  ).toEqual([]);
});

test("skips unsegmented addresses", () => {
  expect(
    validateInterfaceAddressUniqueness(
      {},
      { assignment: "static" },
      { version: 4, bits: 32, prefix: 32, integer: 1n },
      "192.0.2.1",
      { file: "node.yaml", data: { id: 1n } },
      "/interfaces/0/addresses/0/cidr",
      new Map(),
    ),
  ).toEqual([]);
});

test("allows identical virtual assignments but reports non-virtual reuse", () => {
  const assignments = new Map();
  const parsed = { version: 4, bits: 32, prefix: 32, integer: 1n };
  const record = { file: "node.yaml", data: { id: 1n } };
  const validate = (assignment) =>
    validateInterfaceAddressUniqueness(
      { segmentId: 2n },
      { assignment },
      parsed,
      "192.0.2.1",
      record,
      "/interfaces/0/addresses/0/cidr",
      assignments,
    );

  expect(validate("virtual")).toEqual([]);
  expect(validate("virtual")).toEqual([]);
  expect(validate("static")[0].message).toContain("is in use");
  expect(
    validateInterfaceAddressUniqueness(
      { segmentId: 2n },
      { assignment: "virtual" },
      parsed,
      "192.0.2.1",
      record,
      "/interfaces/0/addresses/0/cidr",
      new Map([
        [
          "2:4",
          [
            {
              file: "static.yaml",
              pointer: "/interfaces/0/addresses/0/cidr",
              assignment: "static",
              range: { start: 1n, end: 1n },
            },
          ],
        ],
      ]),
    )[0].message,
  ).toContain("is in use");
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

test("allows matching DHCP lease and reservation addresses", () => {
  const assignments = new Map();
  const parsed = { version: 4, bits: 32, prefix: 32, integer: 1n };
  const record = { file: "node.yaml", data: { id: 1n } };
  validateInterfaceAddressUniqueness(
    { segmentId: 2n, macAddress: "AA-BB-CC-DD-EE-FF" },
    { assignment: "dhcp" },
    parsed,
    "192.0.2.1",
    record,
    "/interfaces/0/addresses/0/cidr",
    assignments,
  );
  expect(
    validateInterfaceAddressUniqueness(
      { segmentId: 2n, macAddress: "aa:bb:cc:dd:ee:ff" },
      { assignment: "dhcp-reservation" },
      parsed,
      "192.0.2.1",
      record,
      "/interfaces/0/addresses/1/cidr",
      assignments,
    ),
  ).toEqual([]);
  expect(
    validateInterfaceAddressUniqueness(
      { segmentId: 2n, macAddress: "aa:bb:cc:dd:ee:ff" },
      { assignment: "dhcp-reservation" },
      parsed,
      "192.0.2.1",
      record,
      "/interfaces/0/addresses/2/cidr",
      assignments,
    ),
  ).toHaveLength(1);
});

test("reports a DHCP address conflict when MAC addresses differ", () => {
  const assignments = new Map();
  const parsed = { version: 4, bits: 32, prefix: 32, integer: 1n };
  const record = { file: "node.yaml", data: { id: 1n } };
  validateInterfaceAddressUniqueness(
    { segmentId: 2n, macAddress: "AA:BB:CC:DD:EE:FF" },
    { assignment: "dhcp" },
    parsed,
    "192.0.2.1",
    record,
    "/interfaces/0/addresses/0/cidr",
    assignments,
  );
  expect(
    validateInterfaceAddressUniqueness(
      { segmentId: 2n, macAddress: "11:22:33:44:55:66" },
      { assignment: "dhcp-reservation" },
      parsed,
      "192.0.2.1",
      record,
      "/interfaces/1/addresses/0/cidr",
      assignments,
    )[0].message,
  ).toContain("is in use");
});

test("checks later conflicts after an allowed DHCP sharing pair", () => {
  const range = { start: 1n, end: 1n };
  const assignments = new Map([
    [
      "2:4",
      [
        {
          file: "lease.yaml",
          pointer: "/interfaces/0/addresses/0/cidr",
          assignment: "dhcp",
          macAddress: "AA:BB:CC:DD:EE:FF",
          range,
        },
        {
          file: "conflict.yaml",
          pointer: "/interfaces/0/addresses/0/cidr",
          assignment: "static",
          range,
        },
      ],
    ],
  ]);
  const diagnostics = validateInterfaceAddressUniqueness(
    { segmentId: 2n, macAddress: "aa-bb-cc-dd-ee-ff" },
    { assignment: "dhcp-reservation" },
    { version: 4, bits: 32, prefix: 32, integer: 1n },
    "192.0.2.1",
    { file: "reservation.yaml", data: { id: 3n } },
    "/interfaces/0/addresses/0/cidr",
    assignments,
  );
  expect(diagnostics[0].message).toContain("is in use at conflict.yaml");
});

test("checks broadcast segments when an interface has no direct segment", () => {
  const assignments = new Map();
  const parsed = { version: 4, bits: 32, prefix: 32, integer: 3221225985n };
  const first = [
    { segmentId: 7n },
    { assignment: "static" },
    parsed,
    "192.0.2.1",
    { file: "first.yaml", data: { id: 1n } },
    "/interfaces/0/addresses/0/cidr",
    assignments,
  ];
  expect(validateInterfaceAddressUniqueness(...first)).toEqual([]);
  expect(
    validateInterfaceAddressUniqueness(
      { wireless: { broadcasts: [{ segmentId: 7n }] } },
      { assignment: "static" },
      parsed,
      "192.0.2.1",
      { file: "radio.yaml", data: { id: 2n } },
      "/interfaces/0/addresses/0/cidr",
      assignments,
    )[0].message,
  ).toContain("is in use at first.yaml");
});
