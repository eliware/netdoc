import { expect, test } from "@jest/globals";
import objectLabel from "../../src/graph/inventory-labels.mjs";

test("labels segments and interfaces with known inventory values", () => {
  expect(
    objectLabel({
      data: {
        kind: "network-segment",
        name: "LAN",
        vlan: "untagged",
        ipNetworks: [{ cidr: "192.0.2.0/24" }],
      },
    }),
  ).toEqual(["network-segment", "LAN", "VLAN: untagged", "192.0.2.0/24"]);
  expect(objectLabel({ data: { kind: "network-segment", name: "No IP" } })).toEqual([
    "network-segment",
    "No IP",
    "VLAN: unknown",
  ]);
});
