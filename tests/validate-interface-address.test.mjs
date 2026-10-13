import { expect, test } from "@jest/globals";
import { validateInterfaceAddress } from "../src/validate-interface-address.mjs";

test("returns a format diagnostic without running later checks", () => {
  const assignments = new Map();
  expect(
    validateInterfaceAddress(
      { segmentId: 1n },
      { cidr: "invalid", assignment: "static" },
      { file: "node.yaml", data: { id: 2n } },
      "/interfaces/0/addresses/0/cidr",
      { ipNetworks: [] },
      assignments,
    ).map(({ message }) => message),
  ).toEqual(["Invalid IP address or prefix 'invalid'."]);
  expect(assignments).toEqual(new Map());
});

test("runs uniqueness and segment checks for a valid address", () => {
  expect(
    validateInterfaceAddress(
      { segmentId: 1n },
      { cidr: "192.0.3.1/24", assignment: "static" },
      { file: "node.yaml", data: { id: 2n } },
      "/interfaces/0/addresses/0/cidr",
      { ipNetworks: [{ cidr: "192.0.2.0/24" }] },
      new Map([["1:4:3221226241", { file: "old.yaml", pointer: "/ip" }]]),
    ).map(({ message }) => message),
  ).toEqual([
    expect.stringContaining("already assigned"),
    expect.stringContaining("outside the networks"),
  ]);
});
