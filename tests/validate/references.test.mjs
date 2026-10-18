import { expect, test } from "@jest/globals";
import { validateReferences } from "../../src/validate/references.mjs";

test("coordinates local, segment, object, and connection checks", () => {
  const record = {
    file: "node.yaml",
    data: {
      kind: "virtual-machine",
      id: 10n,
      residentOn: 999n,
      interfaces: [{ id: 1n, name: "eth0", segmentId: 2n, connectsTo: 8n }],
      networking: { l2Announcements: [{ nodeId: 4n, interfaceName: "eth9" }] },
    },
  };
  const entities = new Map([
    [2n, { kind: "network-segment" }],
    [4n, { kind: "physical-machine", record: { data: { interfaces: [{ name: "eth0" }] } } }],
  ]);
  const pointers = validateReferences([record], entities).map(({ pointer }) => pointer);
  expect(pointers).toEqual(
    expect.arrayContaining([
      "/networking/l2Announcements/0/interfaceName",
      "/residentOn",
      "/interfaces/0/connectsTo",
    ]),
  );
});
