import { expect, test } from "@jest/globals";
import { validateInterfaceAddress } from "../../../src/validate/interface/address.mjs";

test("returns a format diagnostic without running later checks", () => {
  const assignments = new Map();
  expect(
    validateInterfaceAddress(
      { segmentId: 1n },
      { cidr: "invalid", assignment: "static" },
      { file: "node.yaml", data: { id: 2n } },
      "/interfaces/0/addresses/0/cidr",
      new Map([[1n, { kind: "network-segment", record: { data: { ipNetworks: [] } } }]]),
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
      new Map([
        [
          1n,
          { kind: "network-segment", record: { data: { ipNetworks: [{ cidr: "192.0.2.0/24" }] } } },
        ],
      ]),
      new Map([
        [
          "1:4",
          [
            {
              file: "old.yaml",
              pointer: "/ip",
              assignment: "static",
              range: { start: 3221226241n, end: 3221226241n },
            },
          ],
        ],
      ]),
    ).map(({ message }) => message),
  ).toEqual([
    expect.stringContaining("is in use"),
    expect.stringContaining("outside the networks"),
  ]);
  expect(
    validateInterfaceAddress(
      {},
      { cidr: "192.0.3.1/24", assignment: "static" },
      { file: "node.yaml", data: { id: 2n } },
      "/interfaces/0/addresses/0/cidr",
      new Map(),
      new Map(),
    ),
  ).toEqual([]);
});
