import { expect, test } from "@jest/globals";
import { validateObjectReferences } from "../src/validate-object-references.mjs";

test("coordinates announcement, host, BGP peer, and network target rules", () => {
  const record = {
    file: "router.yaml",
    data: {
      kind: "network-device",
      residentOn: [1n],
      networking: {
        l2Announcements: [{ nodeId: 2n, interfaceName: "eth9" }],
        routing: { bgp: { peers: [{ peerId: 3n }] } },
        nat: { rules: [{ nodeId: 4n }] },
        loadBalancing: { listeners: [{ targets: [{ deviceId: 5n }] }] },
      },
    },
  };
  const pointers = validateObjectReferences(record, new Map()).map(({ pointer }) => pointer);
  expect(pointers).toEqual([
    "/networking/l2Announcements/0/interfaceName",
    "/residentOn/0",
    "/networking/routing/bgp/peers/0/peerId",
    "/networking/l2Announcements/0/nodeId",
    "/networking/nat/rules/0/nodeId",
    "/networking/loadBalancing/listeners/0/targets/0/deviceId",
  ]);
  expect(
    validateObjectReferences({ file: "other.yaml", data: { kind: "other" } }, new Map()),
  ).toEqual([]);
});
