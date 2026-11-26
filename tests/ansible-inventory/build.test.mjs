import { expect, test } from "@jest/globals";
import buildInventory from "../../src/ansible-inventory/build.mjs";

test("builds machine hosts, selected variables, and normalized groups", () => {
  const inventory = buildInventory([
    {
      data: {
        kind: "physical-machine",
        name: "NAS",
        id: 42n,
        username: "root",
        roles: ["Storage Host", "backup"],
        operatingSystem: { name: "Debian GNU/Linux", version: "12.8" },
        interfaces: [{ addresses: [{ cidr: "192.0.2.1/24" }] }],
        notes: ["private note"],
        credentials: "private value",
      },
    },
    {
      data: {
        kind: "physical-machine",
        name: "nas backup",
        roles: ["Storage Host"],
        operatingSystem: { name: "Debian GNU/Linux", version: "12.8" },
      },
    },
    {
      data: {
        kind: "virtual-machine",
        name: "worker-1",
        id: 43n,
        roles: [],
        operatingSystem: { name: "Alpine Linux" },
      },
    },
    { data: { kind: "network-device", name: "switch" } },
  ]);

  expect(inventory._meta.hostvars.NAS).toEqual({
    netdoc_name: "NAS",
    netdoc_kind: "physical-machine",
    ansible_host: "NAS",
    ansible_user: "root",
    netdoc_id: "42",
    netdoc_roles: ["Storage Host", "backup"],
    netdoc_operating_system: { name: "Debian GNU/Linux", version: "12.8" },
  });
  expect(inventory._meta.hostvars["nas backup"]).toMatchObject({
    netdoc_name: "nas backup",
    netdoc_operating_system: { name: "Debian GNU/Linux", version: "12.8" },
  });
  expect(inventory._meta.hostvars["worker-1"]).toEqual({
    netdoc_name: "worker-1",
    netdoc_kind: "virtual-machine",
    ansible_host: "worker-1",
    netdoc_id: "43",
    netdoc_roles: [],
    netdoc_operating_system: { name: "Alpine Linux" },
  });
  expect(Object.keys(inventory._meta.hostvars.NAS)).not.toContain("interfaces");
  expect(Object.keys(inventory._meta.hostvars.NAS)).not.toContain("credentials");
  expect(inventory).toMatchObject({
    netdoc_physical_machine: { hosts: ["NAS", "nas backup"] },
    netdoc_virtual_machine: { hosts: ["worker-1"] },
    netdoc_os_debian_gnu_linux_12_8: { hosts: ["NAS", "nas backup"] },
    netdoc_os_alpine_linux: { hosts: ["worker-1"] },
    netdoc_role_storage_host: { hosts: ["NAS", "nas backup"] },
    netdoc_role_backup: { hosts: ["NAS"] },
  });
  expect(inventory.all).toBeUndefined();
  expect(inventory.ungrouped).toBeUndefined();
});

test("uses IDs for case-insensitive duplicate names and omits ambiguous connection hosts", () => {
  const inventory = buildInventory([
    { data: { kind: "physical-machine", name: "Host", id: 1n, roles: [] } },
    { data: { kind: "virtual-machine", name: "host", id: 2n } },
  ]);
  expect(inventory._meta.hostvars.Host_1).toEqual({
    netdoc_name: "Host",
    netdoc_kind: "physical-machine",
    netdoc_id: "1",
    netdoc_roles: [],
  });
  expect(inventory._meta.hostvars.host_2).toEqual({
    netdoc_name: "host",
    netdoc_kind: "virtual-machine",
    netdoc_id: "2",
  });
  expect(inventory.netdoc_physical_machine.hosts).toEqual(["Host_1"]);
  expect(inventory.netdoc_virtual_machine.hosts).toEqual(["host_2"]);
});

test("returns an empty host map when records contain no machines", () => {
  expect(buildInventory([{ data: { kind: "network-device", name: "switch" } }])).toEqual({
    _meta: { hostvars: {} },
  });
});

test("rejects duplicate machine names when a record lacks an ID", () => {
  expect(() =>
    buildInventory([
      { data: { kind: "physical-machine", name: "Host", id: 1n } },
      { data: { kind: "virtual-machine", name: "host" } },
    ]),
  ).toThrow('Machine name "host" collides and the record has no ID.');
});

test("rejects hostnames that collide after adding record IDs", () => {
  expect(() =>
    buildInventory([
      { data: { kind: "physical-machine", name: "Host", id: 9n } },
      { data: { kind: "virtual-machine", name: "host", id: 10n } },
      { data: { kind: "physical-machine", name: "Host_9" } },
    ]),
  ).toThrow('Generated inventory hostname "Host_9" is not unique.');
});

test("rejects distinct roles that normalize to the same group", () => {
  expect(() =>
    buildInventory([
      { data: { kind: "physical-machine", name: "one", roles: ["Web-App"] } },
      { data: { kind: "physical-machine", name: "two", roles: ["web app"] } },
    ]),
  ).toThrow('Distinct values produce the same Ansible group name "netdoc_role_web_app".');
});

test("rejects distinct operating systems that normalize to the same group", () => {
  expect(() =>
    buildInventory([
      {
        data: {
          kind: "physical-machine",
          name: "one",
          operatingSystem: { name: "Debian GNU/Linux" },
        },
      },
      {
        data: {
          kind: "physical-machine",
          name: "two",
          operatingSystem: { name: "debian-gnu-linux" },
        },
      },
    ]),
  ).toThrow('Distinct values produce the same Ansible group name "netdoc_os_debian_gnu_linux".');
});
