import { expect, test } from "@jest/globals";
import { validateRelationships } from "../../src/validation/relationships.mjs";

test("validates references with a shared entity index", () => {
  const record = {
    file: "router.yaml",
    data: {
      kind: "network-device",
      id: 1n,
      interfaces: [{ name: "eth0", segmentId: 99n }],
      switch: { ports: [{ interfaceName: "eth0", mode: "trunk", segmentIds: [99n] }] },
    },
  };

  const diagnostics = validateRelationships({
    inventoryRecords: [record],
    validRecords: [record],
    idDiagnostics: [],
  });

  expect(diagnostics.map(({ pointer }) => pointer)).toEqual([
    "/interfaces/0/segmentId",
    "/switch/ports/0/segmentIds/0",
  ]);
});
