import { expect, test } from "@jest/globals";
import { validateReferences } from "../src/validate-references.mjs";

test("checks local names and object references", () => {
  const entities = new Map([
    [20n, { kind: "network-segment" }],
    [30n, { kind: "virtual-machine" }],
  ]);
  const record = {
    file: "node.yaml",
    data: {
      kind: "virtual-machine",
      id: 1n,
      residentOn: 30n,
      interfaces: [
        { name: "eth0", segmentId: 20n },
        { name: "eth0", parentInterface: "bad" },
      ],
      networking: { routing: { staticRoutes: [{ destination: "0/0", interfaceName: "bad" }] } },
    },
  };
  const diagnostics = validateReferences([record], entities);
  expect(diagnostics.map(({ message }) => message)).toEqual(
    expect.arrayContaining([
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

test("coordinates local and object reference checks", () => {
  const record = {
    file: "node.yaml",
    data: {
      kind: "virtual-machine",
      id: 10n,
      residentOn: 999n,
      interfaces: [{ id: 1n, name: "eth0", segmentId: 2n }],
      networking: { l2Announcements: [{ nodeId: 4n, interfaceName: "eth9" }] },
    },
  };
  const entities = new Map([
    [2n, { kind: "network-segment" }],
    [4n, { kind: "physical-machine", record: { data: { interfaces: [{ name: "eth0" }] } } }],
  ]);
  expect(validateReferences([record], entities).map(({ pointer }) => pointer)).toEqual([
    "/networking/l2Announcements/0/interfaceName",
    "/residentOn",
  ]);
});
