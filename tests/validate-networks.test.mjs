import { expect, test } from "@jest/globals";
import { validateNetworks } from "../src/validate-networks.mjs";

test("combines address, MAC, and segment diagnostics", () => {
  const records = ["first", "second"].map((name, index) => ({
    file: `${name}.yaml`,
    data: {
      kind: "physical-machine",
      id: BigInt(index + 1),
      interfaces: [
        {
          segmentId: 9n,
          macAddress: "AA:BB:CC:DD:EE:FF",
          ...(index === 0 ? { addresses: [{ cidr: "bad", assignment: "static" }] } : {}),
        },
      ],
    },
  }));
  records.push({
    file: "segment.yaml",
    data: {
      kind: "network-segment",
      id: 9n,
      ipNetworks: [{ cidr: "192.0.2.0/24", gateway: "192.0.3.1" }],
    },
  });
  const segment = { kind: "network-segment", record: { data: { kind: "network-segment" } } };
  const diagnostics = validateNetworks(records, new Map([[9n, segment]]));
  expect(diagnostics.map(({ file, pointer }) => [file, pointer])).toEqual([
    ["first.yaml", "/interfaces/0/addresses/0/cidr"],
    ["second.yaml", "/interfaces/0/macAddress"],
    ["segment.yaml", "/ipNetworks/0/gateway"],
  ]);
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
