import { expect, test } from "@jest/globals";
import { validateNetworkTargetReferences } from "../src/validate-network-target-references.mjs";

test("checks announcement, NAT, and load-balancer target IDs", () => {
  const record = {
    file: "router.yaml",
    data: {
      networking: {
        l2Announcements: [{ nodeId: 1n }],
        nat: { rules: [{ nodeId: 2n }, {}] },
        loadBalancing: { listeners: [{ targets: [{ deviceId: 3n }, {}] }, {}] },
      },
    },
  };
  expect(
    validateNetworkTargetReferences(record, new Map([[1n, { kind: "physical-machine" }]])).map(
      ({ pointer }) => pointer,
    ),
  ).toEqual([
    "/networking/nat/rules/0/nodeId",
    "/networking/loadBalancing/listeners/0/targets/0/deviceId",
  ]);
  expect(validateNetworkTargetReferences({ data: {} }, new Map())).toEqual([]);
});
