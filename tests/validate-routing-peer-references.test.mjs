import { expect, test } from "@jest/globals";
import { validateRoutingPeerReferences } from "../src/validate-routing-peer-references.mjs";

test("checks BGP peer IDs and skips peers without IDs", () => {
  const record = {
    file: "router.yaml",
    data: { networking: { routing: { bgp: { peers: [{ peerId: 1n }, {}, { peerId: 2n }] } } } },
  };
  expect(
    validateRoutingPeerReferences(record, new Map([[1n, { kind: "network-device" }]])).map(
      ({ pointer }) => pointer,
    ),
  ).toEqual(["/networking/routing/bgp/peers/2/peerId"]);
  expect(validateRoutingPeerReferences({ data: {} }, new Map())).toEqual([]);
});
