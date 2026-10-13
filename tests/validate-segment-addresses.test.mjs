import { expect, test } from "@jest/globals";
import { validateSegmentAddresses } from "../src/validate-segment-addresses.mjs";

test("collects segment diagnostics across records", () => {
  const records = [
    { file: "first.yaml", data: { kind: "network-segment", ipNetworks: [] } },
    {
      file: "second.yaml",
      data: { kind: "network-segment", ipNetworks: [{ cidr: "bad" }] },
    },
  ];
  expect(validateSegmentAddresses(records).map(({ file }) => file)).toEqual(["second.yaml"]);
});
