import { expect, test } from "@jest/globals";
import { validateSegmentAddresses } from "../src/validate-segment-addresses.mjs";

test("validates segment prefixes and gateways and skips other record kinds", () => {
  const records = [
    {
      file: "segment.yaml",
      data: { kind: "network-segment", id: 1n, ipNetworks: [{ cidr: "bad", gateway: "bad" }] },
    },
    {
      file: "valid.yaml",
      data: {
        kind: "network-segment",
        ipNetworks: [{ cidr: "192.0.2.0/24", gateway: "192.0.2.1" }],
      },
    },
    { file: "node.yaml", data: { kind: "physical-machine" } },
    { file: "empty-segment.yaml", data: { kind: "network-segment" } },
  ];
  expect(validateSegmentAddresses(records).map(({ message }) => message)).toEqual([
    expect.stringContaining("Invalid network prefix"),
    expect.stringContaining("Gateway"),
  ]);
});
