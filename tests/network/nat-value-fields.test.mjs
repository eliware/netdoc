import { expect, test } from "@jest/globals";
import { networkNatValueFields } from "../../src/network/nat-value-fields.mjs";
import { validateNetworkAddressFields } from "../../src/validate/network/address/fields.mjs";

test("collects NAT address and translation fields", () => {
  expect(
    networkNatValueFields({
      nat: {
        rules: [
          { type: "source", source: "any", destination: "192.0.2.1", translation: "masquerade" },
          {
            type: "destination",
            source: "192.0.2.1",
            destination: "192.0.2.2",
            translation: "masquerade",
          },
        ],
      },
    }),
  ).toEqual([
    ["/networking/nat/rules/0/source", "any", false, { allowAny: true }],
    ["/networking/nat/rules/0/destination", "192.0.2.1", false, { allowAny: true }],
    ["/networking/nat/rules/0/translation", "masquerade", false, { allowMasquerade: true }],
    ["/networking/nat/rules/1/source", "192.0.2.1", false, { allowAny: true }],
    ["/networking/nat/rules/1/destination", "192.0.2.2", false, { allowAny: true }],
    ["/networking/nat/rules/1/translation", "masquerade", false],
  ]);
  expect(networkNatValueFields({})).toEqual([]);
});

test("reports invalid NAT addresses", () => {
  expect(
    validateNetworkAddressFields(networkNatValueFields({ nat: { rules: [{ source: "bad" }] } }), {
      file: "router.yaml",
      data: { id: 1n },
    }).map(({ pointer }) => pointer),
  ).toEqual(["/networking/nat/rules/0/source"]);
});

test("allows masquerade only for source NAT", () => {
  const fields = networkNatValueFields({
    nat: {
      rules: [
        { type: "source", translation: "masquerade" },
        { type: "destination", translation: "masquerade" },
      ],
    },
  });
  expect(
    validateNetworkAddressFields(fields, { file: "router.yaml", data: { id: 1n } }).map(
      ({ pointer }) => pointer,
    ),
  ).toEqual(["/networking/nat/rules/1/translation"]);
});
