import { expect, test } from "@jest/globals";
import { validateReferences } from "../src/validate-references.mjs";

test("checks reciprocal interface links and local and object references", () => {
  const entities = new Map([
    [10n, { kind: "interface", networkInterface: { connectsTo: 999n } }],
    [20n, { kind: "network-segment" }],
    [30n, { kind: "virtual-machine" }],
    [99n, { kind: "interface", networkInterface: {} }],
  ]);
  const record = {
    file: "node.yaml",
    data: {
      kind: "virtual-machine",
      id: 1n,
      residentOn: 30n,
      interfaces: [
        { id: 99n, name: "eth0", segmentId: 20n, connectsTo: 10n },
        { name: "eth0", parentInterface: "bad" },
      ],
      networking: { routing: { staticRoutes: [{ destination: "0/0", interfaceName: "bad" }] } },
    },
  };
  const diagnostics = validateReferences([record], entities);
  expect(diagnostics.map(({ message }) => message)).toEqual(
    expect.arrayContaining([
      expect.stringContaining("does not link back"),
      expect.stringContaining("duplicated"),
      expect.stringContaining("does not exist"),
    ]),
  );
});

test("checks switch and device references", () => {
  const record = {
    file: "router.yaml",
    data: {
      kind: "network-device",
      interfaces: [{ name: "p1" }],
      switch: { ports: [{ interfaceName: "p2", segmentId: 8n }] },
      residentOn: [7n],
      networking: { nat: { rules: [{ nodeId: 6n }] } },
    },
  };
  expect(validateReferences([record], new Map()).length).toBe(4);
});

test("rejects self links, absent peers, and non-interface peers", () => {
  const record = {
    file: "x.yaml",
    data: {
      interfaces: [
        { id: 1n, connectsTo: 1n },
        { id: 2n, connectsTo: 8n },
        { id: 3n, connectsTo: 9n },
      ],
    },
  };
  const errors = validateReferences([record], new Map([[9n, { kind: "network-segment" }]]));
  expect(errors.map(({ message }) => message)).toEqual(
    expect.arrayContaining([
      expect.stringContaining("cannot connect to itself"),
      expect.stringContaining("does not resolve to an interface"),
      expect.stringContaining("expected interface"),
    ]),
  );
});

test("accepts reciprocal interface links", () => {
  const map = new Map([
    [1n, { kind: "interface", networkInterface: { connectsTo: 2n } }],
    [2n, { kind: "interface", networkInterface: { connectsTo: 1n } }],
  ]);
  const records = [{ file: "pair.yaml", data: { interfaces: [{ id: 1n, connectsTo: 2n }] } }];
  expect(validateReferences(records, map)).toEqual([]);
});
