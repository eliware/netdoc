import { expect, test } from "@jest/globals";
import { validateDnsNameDuplicates } from "../../../../src/validate/interface/dns-name/duplicates.mjs";

const record = (dnsNames) => ({
  file: "nas.yaml",
  data: {
    id: 10n,
    interfaces: [
      { name: "eth0", addresses: [{ dnsNames }] },
      { name: "eth1", addresses: [{ dnsNames: ["edge.example.net"] }] },
    ],
  },
});

test("accepts missing and unique DNS names", () => {
  expect(validateDnsNameDuplicates({ file: "router.yaml", data: {} })).toEqual([]);
  expect(validateDnsNameDuplicates(record(["nas.example.net", "nas-sql.example.net"]))).toEqual([]);
});

test("reports case-insensitive duplicate DNS names with a field path", () => {
  expect(validateDnsNameDuplicates(record(["nas.example.net", "NAS.Example.Net"]))).toEqual([
    expect.objectContaining({
      file: "nas.yaml",
      pointer: "/interfaces/0/addresses/0/dnsNames/1",
      objectId: 10n,
      message: "DNS name 'NAS.Example.Net' repeats an earlier name for this address.",
    }),
  ]);
});
