import { expect, test } from "@jest/globals";
import { validateNetworks } from "../src/validate-networks.mjs";

test("coordinates interface and segment network checks", () => {
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
          addresses: [{ cidr: "192.0.2.4/24", assignment: "static" }],
        },
      ],
    },
  }));
  records[1].data.interfaces[0].addresses.push({ cidr: "broken", assignment: "static" });
  records.push({
    file: "invalid-segment.yaml",
    data: { kind: "network-segment", id: 3n, ipNetworks: [{ cidr: "bad", gateway: "bad" }] },
  });

  expect(validateNetworks(records, entities).map(({ message }) => message)).toEqual(
    expect.arrayContaining([
      expect.stringContaining("already used"),
      expect.stringContaining("already assigned"),
      expect.stringContaining("Invalid IP address"),
      expect.stringContaining("Invalid network prefix"),
      expect.stringContaining("Gateway"),
    ]),
  );
});

test("allows dynamic or unsegmented interfaces and skips non-segment records", () => {
  const record = {
    file: "node.yaml",
    data: {
      kind: "physical-machine",
      interfaces: [{ name: "dynamic", addresses: [{ assignment: "dhcp" }] }, { name: "plain" }],
    },
  };
  expect(validateNetworks([record], new Map())).toEqual([]);
});
