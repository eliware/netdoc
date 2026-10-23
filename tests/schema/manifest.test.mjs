import { expect, test } from "@jest/globals";
import { schemaFiles } from "../../src/schema/manifest.mjs";

test("lists every schema file", () => {
  expect([...schemaFiles].sort()).toEqual([
    "common.schema.yaml",
    "hardware-storage.schema.yaml",
    "interface-switch.schema.yaml",
    "network-configuration.schema.yaml",
    "network-device.schema.yaml",
    "network-dhcp.schema.yaml",
    "network-firewall-nat.schema.yaml",
    "network-interface-addresses.schema.yaml",
    "network-interface-constraints.schema.yaml",
    "network-interface-fields.schema.yaml",
    "network-interface.schema.yaml",
    "network-load-balancing.schema.yaml",
    "network-routing-tunnels.schema.yaml",
    "network-segment.schema.yaml",
    "physical-machine.schema.yaml",
    "switch.schema.yaml",
    "virtual-machine.schema.yaml",
    "wireless-network.schema.yaml",
  ]);
});
