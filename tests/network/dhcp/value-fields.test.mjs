import { expect, test } from "@jest/globals";
import { dhcpScopeFields } from "../../../src/network/dhcp/value-fields.mjs";

test("collects DHCP scope and reservation addresses", () => {
  expect(
    dhcpScopeFields({
      dhcp: {
        scopes: [
          {
            network: "192.0.2.0/24",
            rangeStart: "192.0.2.10",
            rangeEnd: "192.0.2.20",
            gateway: "192.0.2.1",
            reservations: [{ address: "192.0.2.11" }],
          },
        ],
      },
    }),
  ).toEqual([
    ["/networking/dhcp/scopes/0/network", "192.0.2.0/24", true],
    ["/networking/dhcp/scopes/0/rangeStart", "192.0.2.10", false],
    ["/networking/dhcp/scopes/0/rangeEnd", "192.0.2.20", false],
    ["/networking/dhcp/scopes/0/gateway", "192.0.2.1", false],
    ["/networking/dhcp/scopes/0/reservations/0/address", "192.0.2.11", false],
  ]);
});

test("collects empty DHCP scopes without reservations", () => {
  expect(dhcpScopeFields({ dhcp: { scopes: [{}] } })).toHaveLength(4);
  expect(dhcpScopeFields({})).toEqual([]);
});
