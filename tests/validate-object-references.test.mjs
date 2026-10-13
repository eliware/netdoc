import { expect, test } from "@jest/globals";
import { validateObjectReferences } from "../src/validate-object-references.mjs";

test("coordinates host and routing peer reference rules", () => {
  const record = {
    file: "router.yaml",
    data: {
      kind: "network-device",
      residentOn: [1n],
      networking: { routing: { bgp: { peers: [{ peerId: 3n }] } } },
    },
  };
  const pointers = validateObjectReferences(record, new Map()).map(({ pointer }) => pointer);
  expect(pointers).toEqual(["/residentOn/0", "/networking/routing/bgp/peers/0/peerId"]);
  expect(
    validateObjectReferences({ file: "other.yaml", data: { kind: "other" } }, new Map()),
  ).toEqual([]);
});
