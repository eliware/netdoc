import { expect, test } from "@jest/globals";
import { buildAddressPoolElements } from "../../../src/graph/networking/address-pools.mjs";

test("renders CIDR and address-range pools", () => {
  expect(
    buildAddressPoolElements(2, "object_2", [
      { cidr: "10.0.0.0/24" },
      { start: "10.0.1.1", end: "10.0.1.20" },
    ]),
  ).toEqual({
    nodes: [
      'address_pool_2_0["Load balancer address pool<br/>10.0.0.0/24"]',
      'address_pool_2_1["Load balancer address pool<br/>10.0.1.1 - 10.0.1.20"]',
    ],
    edges: [
      "object_2 -->|address pool| address_pool_2_0",
      "object_2 -->|address pool| address_pool_2_1",
    ],
  });
  expect(buildAddressPoolElements(0, "object_0", [])).toEqual({ nodes: [], edges: [] });
});
