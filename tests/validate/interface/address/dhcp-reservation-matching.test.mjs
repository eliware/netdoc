import { expect, test } from "@jest/globals";
import { isMatchingDhcpReservation } from "../../../../src/validate/interface/address/dhcp-reservation-matching.mjs";
import { validateInterfaceAddressUniqueness } from "../../../../src/validate/interface/address/uniqueness.mjs";

test("matches DHCP leases and reservations with the same normalized MAC", () => {
  const lease = { assignment: "dhcp", macAddress: "AA-BB-CC-DD-EE-FF" };
  const reservation = { segmentId: 2n, macAddress: "aa:bb:cc:dd:ee:ff" };
  expect(isMatchingDhcpReservation(lease, reservation, { assignment: "dhcp-reservation" })).toBe(
    true,
  );
  expect(
    isMatchingDhcpReservation({ ...lease, assignment: "dhcp-reservation" }, reservation, {
      assignment: "dhcp",
    }),
  ).toBe(true);
});

test("rejects other assignment pairs and missing or different MAC addresses", () => {
  const previous = { assignment: "dhcp", macAddress: "AA:BB:CC:DD:EE:FF" };
  const current = { assignment: "dhcp-reservation" };
  expect(isMatchingDhcpReservation(previous, current, { assignment: "static" })).toBe(false);
  expect(
    isMatchingDhcpReservation({ assignment: "dhcp" }, current, { assignment: "dhcp-reservation" }),
  ).toBe(false);
  expect(isMatchingDhcpReservation(previous, {}, { assignment: "dhcp-reservation" })).toBe(false);
  expect(
    isMatchingDhcpReservation(
      previous,
      { macAddress: "11:22:33:44:55:66" },
      { assignment: "dhcp-reservation" },
    ),
  ).toBe(false);
});

test("allows a DHCP lease that matches its MAC reservation", () => {
  const assignments = new Map();
  const address = { version: 4, bits: 32, prefix: 32, integer: 1n };
  const networkInterface = { segmentId: 2n, macAddress: "AA-BB-CC-DD-EE-FF" };
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

test("reports a DHCP conflict when its reservation uses a different MAC", () => {
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
