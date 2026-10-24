import { expect, test } from "@jest/globals";
import { buildBgpElements } from "../../../src/graph/networking/bgp.mjs";

test("renders known BGP peers as edges and unknown peers as nodes", () => {
  const result = buildBgpElements(
    2,
    "object_2",
    {
      routing: {
        bgp: {
          localAs: 64512,
          peers: [{ peerId: 1n, address: "192.0.2.2", remoteAs: 64513 }, { address: "192.0.2.3" }],
        },
      },
    },
    { objectNodeById: new Map([[1n, "object_1"]]) },
  );
  expect(result.edges).toEqual([
    "object_2 -->|BGP AS 64512 to 64513 / 192.0.2.2| object_1",
    "object_2 -->|BGP peer| bgp_peer_2_1",
  ]);
  expect(result.nodes).toEqual([
    'bgp_peer_2_1["BGP peer<br/>192.0.2.3<br/>BGP AS 64512 to unknown"]',
  ]);
});
