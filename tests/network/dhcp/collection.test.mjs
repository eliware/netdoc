import { expect, test } from "@jest/globals";
import collectDhcpFields from "../../../src/network/dhcp/collection.mjs";
import dhcpScopeFields from "../../../src/network/dhcp/value-fields.mjs";

test("collects DHCP fields from network configuration", () => {
  const dhcp = { scopes: [{ network: "192.0.2.0/24" }] };
  expect(collectDhcpFields({ dhcp })).toEqual(dhcpScopeFields(dhcp));
});

test("returns no DHCP fields when networking has no DHCP configuration", () => {
  expect(collectDhcpFields({})).toEqual([]);
});
