import { expect, test } from "@jest/globals";
import { validateDnsNameDuplicatesAcrossRecords } from "../../../../src/validate/interface/dns-name/collection.mjs";

test("collects duplicate DNS names across records", () => {
  const record = (name, dnsNames) => ({
    file: `${name}.yaml`,
    data: { interfaces: [{ addresses: [{ dnsNames }] }] },
  });
  expect(
    validateDnsNameDuplicatesAcrossRecords([
      record("first", ["one.example.net", "ONE.example.net"]),
      record("second", ["two.example.net", "TWO.example.net"]),
    ]).map(({ file }) => file),
  ).toEqual(["first.yaml", "second.yaml"]);
  expect(validateDnsNameDuplicatesAcrossRecords([])).toEqual([]);
});
