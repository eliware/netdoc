import { expect, test } from "@jest/globals";
import buildAnsibleHosts from "../../src/ansible-inventory/hosts.mjs";

test("selects machine hosts and maps allowed variables", () => {
  const result = buildAnsibleHosts([
    {
      data: {
        kind: "physical-machine",
        name: "NAS",
        id: 42n,
        username: "root",
        roles: ["Storage Host", "backup"],
        operatingSystem: { name: "Debian GNU/Linux", version: "12.8" },
        applications: [
          {
            name: "nodejs",
            binds: [{ ip: "127.0.0.1", port: 8080, proto: "tcp", description: "http" }],
            settings: { token: "private" },
          },
        ],
        interfaces: [{ addresses: [{ cidr: "192.0.2.1/24" }] }],
        notes: ["private note"],
        credentials: "private value",
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

  expect(result.hosts).toHaveLength(2);
  expect(result.hostvars.NAS).toEqual({
    netdoc_name: "NAS",
    netdoc_kind: "physical-machine",
    ansible_host: "NAS",
    ansible_user: "root",
    netdoc_id: "42",
    netdoc_roles: ["Storage Host", "backup"],
    netdoc_operating_system: { name: "Debian GNU/Linux", version: "12.8" },
    netdoc_applications: [
      {
        name: "nodejs",
        binds: [{ ip: "127.0.0.1", port: 8080, proto: "tcp", description: "http" }],
      },
    ],
  });
  expect(Object.keys(result.hostvars.NAS)).not.toContain("interfaces");
  expect(Object.keys(result.hostvars.NAS)).not.toContain("credentials");
  expect(JSON.stringify(result.hostvars.NAS)).not.toContain("private");
  expect(result.hostvars["worker-1"].netdoc_operating_system).toEqual({ name: "Alpine Linux" });
});

test("includes an empty application list only when the record declares it", () => {
  const result = buildAnsibleHosts([
    { data: { kind: "physical-machine", name: "with-apps", applications: [] } },
    { data: { kind: "physical-machine", name: "without-apps" } },
  ]);
  expect(result.hostvars["with-apps"].netdoc_applications).toEqual([]);
  expect(result.hostvars["without-apps"]).not.toHaveProperty("netdoc_applications");
});

test("uses IDs for case-insensitive duplicate names and omits ambiguous connection hosts", () => {
  const result = buildAnsibleHosts([
    { data: { kind: "physical-machine", name: "Host", id: 1n, roles: [] } },
    { data: { kind: "virtual-machine", name: "host", id: 2n } },
  ]);
  expect(result.hostvars.Host_1).toEqual({
    netdoc_name: "Host",
    netdoc_kind: "physical-machine",
    netdoc_id: "1",
    netdoc_roles: [],
  });
  expect(result.hostvars.host_2).toEqual({
    netdoc_name: "host",
    netdoc_kind: "virtual-machine",
    netdoc_id: "2",
  });
});

test("rejects duplicate machine names when a record lacks an ID", () => {
  expect(() =>
    buildAnsibleHosts([
      { data: { kind: "physical-machine", name: "Host", id: 1n } },
      { data: { kind: "virtual-machine", name: "host" } },
    ]),
  ).toThrow('Machine name "host" collides and the record has no ID.');
});

test("rejects hostnames that collide after adding record IDs", () => {
  expect(() =>
    buildAnsibleHosts([
      { data: { kind: "physical-machine", name: "Host", id: 9n } },
      { data: { kind: "virtual-machine", name: "host", id: 10n } },
      { data: { kind: "physical-machine", name: "Host_9" } },
    ]),
  ).toThrow('Generated inventory hostname "Host_9" is not unique.');
});

test("returns no hosts for records without machine kinds", () => {
  expect(buildAnsibleHosts([{ data: { kind: "network-device", name: "switch" } }])).toEqual({
    hosts: [],
    hostvars: Object.create(null),
  });
});

test("omits the NetDoc ID variable when a machine has no ID", () => {
  const result = buildAnsibleHosts([
    { data: { kind: "physical-machine", name: "host-without-id" } },
  ]);
  expect(result.hostvars["host-without-id"]).toEqual({
    netdoc_name: "host-without-id",
    netdoc_kind: "physical-machine",
    ansible_host: "host-without-id",
  });
});
