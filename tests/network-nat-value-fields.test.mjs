import { expect, test } from "@jest/globals";
import { networkNatValueFields } from "../src/network-nat-value-fields.mjs";

test("collects NAT address and translation fields", () => {
  expect(
    networkNatValueFields({
      nat: { rules: [{ source: "any", destination: "192.0.2.1", translation: "masquerade" }] },
    }),
  ).toEqual([
    ["/networking/nat/rules/0/source", "any", false, { allowAny: true }],
    ["/networking/nat/rules/0/destination", "192.0.2.1", false, { allowAny: true }],
    ["/networking/nat/rules/0/translation", "masquerade", false],
  ]);
  expect(networkNatValueFields({})).toEqual([]);
});
