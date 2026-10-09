import { expect, test } from "@jest/globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadSchemaValidators } from "../src/schema-validators.mjs";

const root = fileURLToPath(new URL("../docs/schema/", import.meta.url));

test("loads a schema validator for each supported object kind", () => {
  const validators = loadSchemaValidators(root);
  expect(Object.keys(validators).sort()).toEqual([
    "network-device",
    "network-segment",
    "physical-machine",
    "virtual-machine",
  ]);
  expect(
    validators["network-device"]({
      version: "11.0",
      kind: "network-device",
      name: "router",
      roles: ["router"],
      implementation: "physical",
    }),
  ).toBe(true);
});

test("accepts switch ports with access, trunk, and internal router links", () => {
  const validate = loadSchemaValidators(root)["network-device"];
  expect(
    validate({
      version: "11.0",
      kind: "network-device",
      name: "router",
      roles: ["router", "switch"],
      implementation: "physical",
      interfaces: [
        { name: "LAN1", type: "ethernet" },
        { name: "LAN bridge", type: "bridge" },
        {
          name: "VLAN 102",
          type: "vlan",
          parentInterface: "LAN bridge",
          segmentId: 102,
          addresses: [{ cidr: "192.0.2.1/24", assignment: "static" }],
        },
        { name: "uplink", type: "ethernet" },
      ],
      switch: {
        management: "managed",
        ports: [
          {
            interfaceName: "LAN1",
            type: "physical",
            mode: "access",
            segmentId: 101,
          },
          {
            interfaceName: "LAN bridge",
            type: "internal",
            mode: "access",
            segmentId: 101,
          },
          {
            interfaceName: "uplink",
            type: "physical",
            mode: "trunk",
            segmentIds: [102, 103],
            pvidSegmentId: 101,
          },
        ],
      },
    }),
  ).toBe(true);
});

test("rejects invalid switch access and trunk port membership", () => {
  const validate = loadSchemaValidators(root)["network-device"];
  const record = {
    version: "11.0",
    kind: "network-device",
    name: "router",
    roles: ["router"],
    implementation: "physical",
    switch: {
      management: "unmanaged",
      ports: [
        { interfaceName: "LAN1", type: "physical", mode: "access" },
        {
          interfaceName: "LAN2",
          type: "physical",
          mode: "trunk",
          segmentId: 101,
        },
      ],
    },
  };
  expect(validate(record)).toBe(false);
});

test("reports a missing schema file through a load error", () => {
  expect(() => loadSchemaValidators(path.join(root, "missing"))).toThrow();
});
