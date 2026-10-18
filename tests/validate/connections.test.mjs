import { expect, test } from "@jest/globals";
import { validateConnections } from "../../src/validate/connections.mjs";

test("rejects self links, absent peers, and non-interface peers", () => {
  const record = {
    file: "node.yaml",
    data: {
      interfaces: [
        { id: 1n, connectsTo: 1n },
        { id: 2n, connectsTo: 8n },
        { id: 3n, connectsTo: 9n },
      ],
    },
  };
  const errors = validateConnections([record], new Map([[9n, { kind: "network-segment" }]]));
  expect(errors.map(({ message }) => message)).toEqual(
    expect.arrayContaining([
      expect.stringContaining("cannot connect to itself"),
      expect.stringContaining("does not resolve to an interface"),
      expect.stringContaining("Expected interface"),
    ]),
  );
});

test("reports links that do not point back", () => {
  const record = { file: "node.yaml", data: { interfaces: [{ id: 1n, connectsTo: 2n }] } };
  const peer = { kind: "interface", networkInterface: { connectsTo: 3n } };
  expect(
    validateConnections([record], new Map([[2n, peer]])).map(({ message }) => message),
  ).toEqual(["Peer interface 2 does not reference interface 1."]);
});

test("accepts reciprocal interface links", () => {
  const map = new Map([
    [1n, { kind: "interface", networkInterface: { connectsTo: 2n } }],
    [2n, { kind: "interface", networkInterface: { connectsTo: 1n } }],
  ]);
  const records = [{ file: "pair.yaml", data: { interfaces: [{ id: 1n, connectsTo: 2n }] } }];
  expect(validateConnections(records, map)).toEqual([]);
});

test("skips interfaces without a connection or ID", () => {
  const record = {
    file: "node.yaml",
    data: { interfaces: [{ connectsTo: 2n }, { id: 3n }] },
  };
  expect(validateConnections([record], new Map())).toEqual([]);
});

test("does not report links to invalid records", () => {
  const record = { file: "node.yaml", data: { interfaces: [{ id: 1n, connectsTo: 2n }] } };
  expect(
    validateConnections([record], new Map([[2n, { kind: "interface", invalid: true }]])),
  ).toEqual([]);
});
