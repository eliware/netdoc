import { expect, test } from "@jest/globals";
import { checkMac } from "../src/network-mac-address-checks.mjs";

test("checks duplicate MAC addresses within each segment", () => {
  const diagnostics = [];
  const macs = new Map();
  const record = { file: "node.yaml", data: { id: 1n, kind: "physical-machine" } };
  const segment = { kind: "network-segment" };
  const nic = { segmentId: 2n, macAddress: "AA-BB-CC-DD-EE-FF" };
  checkMac(nic, record, "/interfaces/0", segment, macs, diagnostics);
  checkMac(nic, record, "/interfaces/1", segment, macs, diagnostics);
  checkMac({ macAddress: nic.macAddress }, record, "/interfaces/2", segment, macs, diagnostics);
  expect(diagnostics).toHaveLength(1);
  checkMac(nic, record, "/interfaces/3", { kind: "physical-machine" }, macs, diagnostics);
  checkMac(nic, record, "/interfaces/4", undefined, macs, diagnostics);
  expect(diagnostics).toHaveLength(1);
});
