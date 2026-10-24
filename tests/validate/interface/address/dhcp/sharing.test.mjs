import { expect, test } from "@jest/globals";
import { isAllowedDhcpSharing } from "../../../../../src/validate/interface/address/dhcp/sharing.mjs";

test("allows matching DHCP lease and reservation ranges", () => {
  expect(
    isAllowedDhcpSharing(
      {
        assignment: "dhcp",
        macAddress: "AA-BB-CC-DD-EE-FF",
        range: { start: 1n, end: 1n },
      },
      { macAddress: "aa:bb:cc:dd:ee:ff" },
      { assignment: "dhcp-reservation" },
      { start: 1n, end: 1n },
    ),
  ).toBe(true);
});

test("rejects different or non-singleton ranges", () => {
  const previous = {
    assignment: "dhcp",
    macAddress: "AA-BB-CC-DD-EE-FF",
    range: { start: 1n, end: 1n },
  };
  const networkInterface = { macAddress: "aa:bb:cc:dd:ee:ff" };
  const reservation = { assignment: "dhcp-reservation" };
  expect(
    isAllowedDhcpSharing(previous, networkInterface, reservation, { start: 2n, end: 2n }),
  ).toBe(false);
  expect(
    isAllowedDhcpSharing(previous, networkInterface, reservation, { start: 1n, end: 2n }),
  ).toBe(false);
});
