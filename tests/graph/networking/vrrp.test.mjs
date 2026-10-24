import { expect, test } from "@jest/globals";
import { buildVrrpElements } from "../../../src/graph/networking/vrrp.mjs";

test("renders configured VRRP groups without an interface name", () => {
  expect(
    buildVrrpElements(1, "object_1", {
      routing: { vrrp: [{ vrid: 9, virtualAddresses: ["192.0.2.1"] }] },
    }),
  ).toEqual({
    nodes: ['vrrp_1_0["Configured VRRP<br/>VRID 9<br/>192.0.2.1"]'],
    edges: ["object_1 -->|VRRP interface unknown| vrrp_1_0"],
  });
});
