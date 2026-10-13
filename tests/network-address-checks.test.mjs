import { expect, test } from "@jest/globals";
import { checkMac } from "../src/network-address-checks.mjs";

test("checks duplicate MAC addresses", () => {
  const diagnostics = [];
  const macs = new Map();
  const record = { file: "node.yaml", data: { id: 1n, kind: "physical-machine" } };
  const nic = { segmentId: 2n, macAddress: "AA-BB-CC-DD-EE-FF" };
  checkMac(nic, record, "/interfaces/0", undefined, macs, diagnostics);
  checkMac(nic, record, "/interfaces/1", undefined, macs, diagnostics);
  checkMac({}, record, "/interfaces/2", undefined, macs, diagnostics);
  expect(diagnostics).toHaveLength(1);
});
