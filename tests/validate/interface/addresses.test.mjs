import { expect, test } from "@jest/globals";
import validateInterfaceAddresses from "../../../src/validate/interface/addresses.mjs";

test("aggregates interface format and segment diagnostics across records", () => {
  const segment = {
    kind: "network-segment",
    record: { data: { ipNetworks: [{ cidr: "192.0.2.0/24" }] } },
  };
  const entities = new Map([[1n, segment]]);
  const records = ["a", "b"].map((name, index) => ({
    file: `${name}.yaml`,
    data: {
      id: BigInt(index + 2),
      interfaces: [
        {
          segmentId: 1n,
          addresses: [{ cidr: `192.0.2.${index + 4}/24`, assignment: "static" }],
        },
      ],
    },
  }));
  records[1].data.interfaces[0].addresses.push(
    { cidr: "broken", assignment: "static" },
    { cidr: "192.0.3.4/24", assignment: "static" },
  );
  expect(validateInterfaceAddresses(records, entities).map(({ message }) => message)).toEqual(
    expect.arrayContaining([
      expect.stringContaining("Invalid IP address"),
      expect.stringContaining("outside the networks"),
    ]),
  );
});

test("accepts dynamic or unsegmented interfaces and ignores unknown segment kinds", () => {
  const record = {
    file: "node.yaml",
    data: {
      interfaces: [
        { addresses: [{ assignment: "dhcp" }] },
        {},
        { segmentId: 3n, addresses: [{ cidr: "192.0.2.1", assignment: "static" }] },
      ],
    },
  };
  expect(
    validateInterfaceAddresses(
      [record, { file: "empty.yaml", data: {} }],
      new Map([[3n, { kind: "physical-machine" }]]),
    ),
  ).toEqual([]);
});
