import { expect, test } from "@jest/globals";
import validateInterfaceAddressUniqueness from "../../../../src/validate/interface/address/uniqueness.mjs";

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
