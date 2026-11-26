import { expect, test } from "@jest/globals";
import buildAnsibleGroups from "../../src/ansible-inventory/groups.mjs";

test("builds normalized groups from machine types, systems, and roles", () => {
  expect(
    buildAnsibleGroups([
      {
        hostname: "NAS",
        machine: {
          kind: "physical-machine",
          roles: ["Storage Host", "backup"],
          operatingSystem: { name: "Debian GNU/Linux", version: "12.8" },
        },
      },
      {
        hostname: "nas backup",
        machine: {
          kind: "physical-machine",
          roles: ["Storage Host"],
          operatingSystem: { name: "Debian GNU/Linux", version: "12.8" },
        },
      },
      {
        hostname: "worker-1",
        machine: {
          kind: "virtual-machine",
          roles: [],
          operatingSystem: { name: "Alpine Linux" },
        },
      },
    ]),
  ).toEqual({
    netdoc_physical_machine: { hosts: ["NAS", "nas backup"] },
    netdoc_os_debian_gnu_linux_12_8: { hosts: ["NAS", "nas backup"] },
    netdoc_role_storage_host: { hosts: ["NAS", "nas backup"] },
    netdoc_role_backup: { hosts: ["NAS"] },
    netdoc_virtual_machine: { hosts: ["worker-1"] },
    netdoc_os_alpine_linux: { hosts: ["worker-1"] },
  });
});

test("rejects distinct roles that normalize to the same group", () => {
  expect(() =>
    buildAnsibleGroups([
      { hostname: "one", machine: { kind: "physical-machine", roles: ["Web-App"] } },
      { hostname: "two", machine: { kind: "physical-machine", roles: ["web app"] } },
    ]),
  ).toThrow('Distinct values produce the same Ansible group name "netdoc_role_web_app".');
});

test("rejects distinct operating systems that normalize to the same group", () => {
  expect(() =>
    buildAnsibleGroups([
      {
        hostname: "one",
        machine: { kind: "physical-machine", operatingSystem: { name: "Debian GNU/Linux" } },
      },
      {
        hostname: "two",
        machine: { kind: "physical-machine", operatingSystem: { name: "debian-gnu-linux" } },
      },
    ]),
  ).toThrow('Distinct values produce the same Ansible group name "netdoc_os_debian_gnu_linux".');
});
