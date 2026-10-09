import { expect, test } from "@jest/globals";
import { validateNetworks } from "../src/validate-networks.mjs";

test("checks invalid and out-of-segment IPs and duplicate IP and MAC values", () => {
  const segment = {
    kind: "network-segment",
    record: { data: { ipNetworks: [{ cidr: "192.0.2.0/24" }] } },
  };
  const entities = new Map([[1n, segment]]);
  const records = ["a", "b"].map((name, i) => ({
    file: `${name}.yaml`,
    data: {
      kind: "physical-machine",
      id: BigInt(i + 2),
      interfaces: [
        {
          name: "eth0",
          segmentId: 1n,
          macAddress: "AA:BB:CC:DD:EE:FF",
          addresses: [{ cidr: i ? "192.0.2.4/24" : "192.0.3.4/24", assignment: "static" }],
        },
      ],
    },
  }));
  records[1].data.interfaces[0].addresses.push({ cidr: "broken", assignment: "static" });
  expect(validateNetworks(records, entities).map(({ message }) => message)).toEqual(
    expect.arrayContaining([
      expect.stringContaining("already used"),
      expect.stringContaining("outside the networks"),
      expect.stringContaining("Invalid IP address"),
    ]),
  );
});

test("checks segment network and gateway syntax and allows shared virtual addresses", () => {
  const segment = {
    file: "segment.yaml",
    data: { kind: "network-segment", id: 1n, ipNetworks: [{ cidr: "bad", gateway: "bad" }] },
  };
  const shared = ["a", "b"].map((file) => ({
    file,
    data: {
      id: 2n,
      interfaces: [
        { name: "wg", segmentId: 1n, addresses: [{ cidr: "192.0.2.1/24", assignment: "virtual" }] },
      ],
    },
  }));
  const diagnostics = validateNetworks(
    [segment, ...shared],
    new Map([[1n, { kind: "network-segment", record: { data: {} } }]]),
  );
  expect(diagnostics).toHaveLength(2);
});

test("accepts dynamic or unsegmented interfaces and detects address conflicts", () => {
  const segment = { kind: "network-segment", record: { data: { ipNetworks: [] } } };
  const record = {
    file: "node.yaml",
    data: {
      interfaces: [
        { name: "dynamic", addresses: [{ assignment: "dhcp" }] },
        { name: "plain" },
        { name: "one", segmentId: 1n, addresses: [{ cidr: "192.0.2.1", assignment: "static" }] },
        { name: "two", segmentId: 1n, addresses: [{ cidr: "192.0.2.1", assignment: "static" }] },
        { name: "three", segmentId: 2n, addresses: [{ cidr: "192.0.2.1", assignment: "static" }] },
      ],
    },
  };
  const errors = validateNetworks(
    [record],
    new Map([
      [1n, segment],
      [2n, { kind: "network-segment", record: { data: {} } }],
    ]),
  );
  expect(errors.map(({ message }) => message)).toEqual([
    expect.stringContaining("already assigned"),
  ]);
});
