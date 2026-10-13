import { expect, test } from "@jest/globals";
import { networkVrrpValueFields } from "../src/network-vrrp-value-fields.mjs";

test("collects VRRP virtual addresses", () => {
  expect(
    networkVrrpValueFields({ routing: { vrrp: [{ virtualAddresses: ["192.0.2.1"] }, {}] } }),
  ).toEqual([["/networking/routing/vrrp/0/virtualAddresses/0", "192.0.2.1", false]]);
  expect(networkVrrpValueFields({})).toEqual([]);
});
