import { expect, test } from "@jest/globals";
import { checkInterfaceAddresses } from "../src/network-interface-address-checks.mjs";

test("reports invalid addresses and skips assignments without a CIDR", () => {
  const diagnostics = [];
  checkInterfaceAddresses(
    { addresses: [{ assignment: "dhcp" }, { cidr: "broken", assignment: "static" }] },
    { file: "node.yaml", data: { id: 1n } },
    "/interfaces/0",
    undefined,
    new Map(),
    diagnostics,
  );
  expect(diagnostics.map(({ message }) => message)).toEqual([
    "Invalid IP address or prefix 'broken'.",
  ]);
});

test("reports duplicate assigned addresses and addresses outside the segment", () => {
  const diagnostics = [];
  const assignments = new Map([
    ["1:4:3221226241", { file: "first.yaml", pointer: "/interfaces/0/addresses/0/cidr" }],
  ]);
  checkInterfaceAddresses(
    {
      segmentId: 1n,
      addresses: [{ cidr: "192.0.3.1/24", assignment: "static" }],
    },
    { file: "second.yaml", data: { id: 2n } },
    "/interfaces/0",
    { ipNetworks: [{ cidr: "192.0.2.0/24" }] },
    assignments,
    diagnostics,
  );
  expect(diagnostics.map(({ message }) => message)).toEqual([
    expect.stringContaining("already assigned"),
    expect.stringContaining("outside the networks"),
  ]);
});

test("allows shared virtual addresses and addresses on separate segments", () => {
  const diagnostics = [];
  const assignments = new Map();
  const record = { file: "node.yaml", data: { id: 3n } };
  const segment = { ipNetworks: [] };
  checkInterfaceAddresses(
    { segmentId: 1n, addresses: [{ cidr: "192.0.2.1", assignment: "static" }] },
    record,
    "/interfaces/0",
    segment,
    assignments,
    diagnostics,
  );
  checkInterfaceAddresses(
    { segmentId: 1n, addresses: [{ cidr: "192.0.2.1", assignment: "virtual" }] },
    record,
    "/interfaces/1",
    segment,
    assignments,
    diagnostics,
  );
  checkInterfaceAddresses(
    { segmentId: 2n, addresses: [{ cidr: "192.0.2.1", assignment: "static" }] },
    record,
    "/interfaces/2",
    segment,
    assignments,
    diagnostics,
  );
  checkInterfaceAddresses(
    { addresses: [{ cidr: "192.0.2.2", assignment: "static" }] },
    record,
    "/interfaces/3",
    undefined,
    assignments,
    diagnostics,
  );
  expect(diagnostics).toEqual([]);
});

test("checks containment against any configured segment network", () => {
  const diagnostics = [];
  checkInterfaceAddresses(
    { segmentId: 1n, addresses: [{ cidr: "192.0.2.1/24", assignment: "static" }] },
    { file: "node.yaml", data: { id: 4n } },
    "/interfaces/0",
    { ipNetworks: [{ cidr: "192.0.3.0/24" }, { cidr: "192.0.2.0/24" }] },
    new Map(),
    diagnostics,
  );
  expect(diagnostics).toEqual([]);
});
