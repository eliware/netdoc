import { expect, test } from "@jest/globals";
import { validateObjectReferences } from "../src/validate-object-references.mjs";

test("checks object reference target kinds", () => {
  const data = {
    kind: "network-device",
    residentOn: [1n],
    networking: {
      routing: { bgp: { peers: [{ peerId: 2n }] } },
      loadBalancing: { listeners: [{ targets: [{ deviceId: 3n }] }] },
    },
  };
  const entities = new Map([
    [1n, { kind: "interface" }],
    [2n, { kind: "physical-machine" }],
    [3n, { kind: "network-device" }],
  ]);
  expect(validateObjectReferences({ file: "r.yaml", data }, entities)).toHaveLength(1);
  expect(validateObjectReferences({ file: "ok.yaml", data: { kind: "other" } }, entities)).toEqual(
    [],
  );
  expect(
    validateObjectReferences(
      { file: "vm.yaml", data: { kind: "virtual-machine", residentOn: 2n } },
      entities,
    ),
  ).toHaveLength(0);
  const optional = {
    kind: "network-device",
    networking: {
      l2Announcements: [{ nodeId: 77n }],
      nat: { rules: [{}] },
      routing: { bgp: { peers: [{}] } },
      loadBalancing: { listeners: [{ targets: [{}] }, {}] },
    },
  };
  expect(
    validateObjectReferences({ file: "optional.yaml", data: optional }, entities),
  ).toHaveLength(1);
});
