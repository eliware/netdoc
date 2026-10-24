import { expect, test } from "@jest/globals";
import { validateSegmentAddresses } from "../../../src/validate/segment/addresses.mjs";

test("coordinates prefix and gateway checks across segment records", () => {
  const records = [
    { file: "first.yaml", data: { kind: "network-segment", ipNetworks: [] } },
    { file: "empty.yaml", data: { kind: "network-segment" } },
    {
      file: "second.yaml",
      data: {
        kind: "network-segment",
        ipNetworks: [{ cidr: "192.0.2.0/24", gateway: "192.0.3.1" }],
      },
    },
    {
      file: "third.yaml",
      data: {
        kind: "network-segment",
        ipNetworks: [{ cidr: "bad", gateway: "203.0.113.1" }],
      },
    },
  ];
  expect(validateSegmentAddresses(records).map(({ file, pointer }) => [file, pointer])).toEqual([
    ["second.yaml", "/ipNetworks/0/gateway"],
    ["third.yaml", "/ipNetworks/0/cidr"],
    ["third.yaml", "/ipNetworks/0/gateway"],
  ]);
});
