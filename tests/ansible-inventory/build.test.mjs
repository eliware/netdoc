import { expect, test } from "@jest/globals";
import buildInventory from "../../src/ansible-inventory/build.mjs";

test("assembles hosts and groups into an Ansible inventory", () => {
  const inventory = buildInventory([
    {
      data: {
        kind: "physical-machine",
        name: "nas",
        roles: ["storage"],
        applications: [{ name: "nodejs", binds: [] }],
      },
    },
  ]);
  expect(inventory._meta.hostvars.nas).toBeDefined();
  expect(inventory.netdoc_physical_machine.hosts).toEqual(["nas"]);
  expect(inventory.netdoc_role_storage.hosts).toEqual(["nas"]);
  expect(inventory.netdoc_application_nodejs.hosts).toEqual(["nas"]);
});

test("returns an empty host map when records contain no machines", () => {
  expect(buildInventory([{ data: { kind: "network-device", name: "switch" } }])).toEqual({
    _meta: { hostvars: {} },
  });
});
