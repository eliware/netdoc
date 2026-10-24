import { expect, test } from "@jest/globals";
import { buildVrrpElements } from "../../../src/graph/networking/vrrp.mjs";

test("renders configured VRRP groups without an interface name", () => {
  expect(
    buildVrrpElements(
      0,
      "object_0",
      {
        routing: { vrrp: [{ vrid: 9, virtualAddresses: ["192.0.2.1"] }] },
      },
      { records: [{ data: { interfaces: [] } }] },
    ),
  ).toEqual({
    nodes: ['vrrp_0_0["Configured VRRP<br/>VRID 9<br/>192.0.2.1"]'],
    edges: ["object_0 -->|VRRP interface unknown| vrrp_0_0"],
  });
});

test("links a VRRP group to its configured interface", () => {
  expect(
    buildVrrpElements(
      0,
      "object_0",
      { routing: { vrrp: [{ vrid: 9, interfaceName: "eth0", virtualAddresses: [] }] } },
      { records: [{ data: { interfaces: [{ name: "eth0" }] } }] },
    ),
  ).toEqual({
    nodes: ['vrrp_0_0["Configured VRRP<br/>VRID 9"]'],
    edges: ["object_0 -->|eth0| vrrp_0_0", "vrrp_0_0 -->|uses interface| interface_0_0"],
  });
});
