import { beforeAll, expect, test } from "@jest/globals";
import { fileURLToPath } from "node:url";
import validateApplications from "../../src/validate/applications.mjs";
import loadSchemaValidators from "../../src/schema/validators.mjs";

const schemaRoot = fileURLToPath(new URL("../../specs/schema/", import.meta.url));
let validators;

beforeAll(() => {
  validators = loadSchemaValidators(schemaRoot);
});

test("allows absent or unique declared applications", () => {
  expect(validateApplications({ file: "empty.yaml", data: {} })).toEqual([]);
  expect(
    validateApplications({
      file: "machine.yaml",
      data: { applications: [{ name: "nodejs" }, { name: "nginx" }] },
    }),
  ).toEqual([]);
});

test("reports repeated application names", () => {
  expect(
    validateApplications({
      file: "machine.yaml",
      data: {
        id: 7n,
        applications: [{ name: "nodejs" }, { name: "nginx" }, { name: "nodejs" }],
      },
    }),
  ).toEqual([
    expect.objectContaining({
      file: "machine.yaml",
      pointer: "/applications/2/name",
      objectId: 7n,
      message: "Application name 'nodejs' is repeated.",
    }),
  ]);
});

test("validates application fields for physical and virtual machines", () => {
  const physical = {
    version: "11.0",
    kind: "physical-machine",
    name: "host",
    lastReviewed: "2026-11-27",
    roles: ["server"],
  };
  const virtual = {
    version: "11.0",
    kind: "virtual-machine",
    name: "vm",
    lastReviewed: "2026-11-27",
    residentOn: 7,
  };
  const application = {
    name: "nodejs",
    binds: [
      { ip: "127.0.0.1", port: 8080, proto: "tcp", description: "http" },
      { ip: "::", port: 5353, proto: "udp", description: "dns" },
      { ip: "0.0.0.0", port: 1, proto: "tcp", description: "lowest port" },
      { ip: "::", port: 65535, proto: "udp", description: "highest port" },
    ],
  };
  expect(validators["physical-machine"]({ ...physical, applications: [application] })).toBe(true);
  expect(
    validators["virtual-machine"]({ ...virtual, applications: [{ name: "nginx", binds: [] }] }),
  ).toBe(true);
  expect(validators["physical-machine"](physical)).toBe(true);

  const invalidApplications = [
    [{ name: "NodeJS", binds: [] }],
    [{ name: "node js", binds: [] }],
    [{ name: "nodejs" }],
    [{ name: "nodejs", binds: [{ ip: "bad", port: 80, proto: "tcp", description: "http" }] }],
    [{ name: "nodejs", binds: [{ ip: "0.0.0.0", port: 0, proto: "tcp", description: "http" }] }],
    [{ name: "nodejs", binds: [{ ip: "::", port: 65536, proto: "tcp", description: "http" }] }],
    [{ name: "nodejs", binds: [{ ip: "::", port: 80, proto: "icmp", description: "web" }] }],
    [{ name: "nodejs", binds: [{ ip: "::", port: 80, proto: "tcp" }] }],
    [{ name: "nodejs", binds: [], settings: { token: "secret" } }],
  ];
  for (const applications of invalidApplications)
    expect(validators["physical-machine"]({ ...physical, applications })).toBe(false);
});
