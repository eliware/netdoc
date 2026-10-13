import { expect, test } from "@jest/globals";
import { validateNetworks } from "../src/validate-networks.mjs";

test("combines interface, MAC, and segment diagnostics", () => {
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

  const diagnostics = validateNetworks(records, entities);
  expect(diagnostics).toHaveLength(5);
  expect(new Set(diagnostics.map(({ file }) => file))).toEqual(
    new Set(["b.yaml", "invalid-segment.yaml"]),
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
