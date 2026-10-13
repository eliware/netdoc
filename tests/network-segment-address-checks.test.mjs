import { expect, test } from "@jest/globals";
import { checkSegmentAddresses } from "../src/network-segment-address-checks.mjs";

test("checks segment network and gateway values", () => {
  const diagnostics = [];
  checkSegmentAddresses(
    {
      file: "segment.yaml",
      data: { kind: "network-segment", id: 1n, ipNetworks: [{ cidr: "bad", gateway: "bad" }] },
    },
    diagnostics,
  );
  checkSegmentAddresses(
    {
      file: "valid.yaml",
      data: {
        kind: "network-segment",
        ipNetworks: [{ cidr: "192.0.2.0/24", gateway: "192.0.2.1" }],
      },
    },
    diagnostics,
  );
  checkSegmentAddresses({ file: "node.yaml", data: { kind: "physical-machine" } }, diagnostics);
  checkSegmentAddresses(
    { file: "empty-segment.yaml", data: { kind: "network-segment" } },
    diagnostics,
  );
  expect(diagnostics.map(({ message }) => message)).toEqual([
    expect.stringContaining("Invalid network prefix"),
    expect.stringContaining("Gateway"),
  ]);
});
