import { expect, test } from "@jest/globals";
import { checkMac, checkSegmentAddresses } from "../src/network-address-checks.mjs";

test("checks duplicate MAC addresses and segment network syntax", () => {
  const diagnostics = [];
  const macs = new Map();
  const record = { file: "node.yaml", data: { id: 1n, kind: "physical-machine" } };
  const nic = { segmentId: 2n, macAddress: "AA-BB-CC-DD-EE-FF" };
  checkMac(nic, record, "/interfaces/0", undefined, macs, diagnostics);
  checkMac(nic, record, "/interfaces/1", undefined, macs, diagnostics);
  checkMac({}, record, "/interfaces/2", undefined, macs, diagnostics);
  checkSegmentAddresses(
    {
      file: "segment.yaml",
      data: { kind: "network-segment", ipNetworks: [{ cidr: "bad", gateway: "bad" }] },
    },
    diagnostics,
  );
  checkSegmentAddresses({ file: "node.yaml", data: { kind: "physical-machine" } }, diagnostics);
  checkSegmentAddresses(
    { file: "segment-empty.yaml", data: { kind: "network-segment" } },
    diagnostics,
  );
  checkSegmentAddresses(
    {
      file: "ok.yaml",
      data: {
        kind: "network-segment",
        ipNetworks: [{ cidr: "192.0.2.0/24", gateway: "192.0.2.1" }],
      },
    },
    diagnostics,
  );
  expect(diagnostics).toHaveLength(3);
});
