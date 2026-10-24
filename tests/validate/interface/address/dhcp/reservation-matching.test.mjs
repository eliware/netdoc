import { expect, test } from "@jest/globals";
import { isMatchingDhcpReservation } from "../../../../../src/validate/interface/address/dhcp/reservation-matching.mjs";

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
