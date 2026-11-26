import { expect, test } from "@jest/globals";
import validateNetworks from "../../src/validate/networks.mjs";

test("coordinates interface, MAC, segment, and DNS address checks", () => {
  const first = {
    file: "first.yaml",
    data: {
      kind: "physical-machine",
      id: 1n,
      interfaces: [
        {
          segmentId: 9n,
          macAddress: "AA:BB:CC:DD:EE:FF",
          addresses: [
            { cidr: "bad", assignment: "static" },
            {
              cidr: "192.0.2.10/24",
              assignment: "static",
              dnsNames: ["nas.example.net", "NAS.example.net"],
            },
          ],
        },
      ],
    },
  };
  const second = {
    file: "second.yaml",
    data: {
      kind: "physical-machine",
      id: 2n,
      interfaces: [
        {
          segmentId: 9n,
          macAddress: "AA:BB:CC:DD:EE:FF",
          addresses: [{ cidr: "192.0.2.11/24", assignment: "static" }],
        },
      ],
    },
  };
  const segmentRecord = {
    file: "segment.yaml",
    data: {
      kind: "network-segment",
      id: 9n,
      ipNetworks: [{ cidr: "192.0.2.0/24", gateway: "192.0.3.1" }],
    },
  };
  const segment = { kind: "network-segment", record: segmentRecord };
  const unaddressed = { file: "unaddressed.yaml", data: { interfaces: [{}] } };

  const diagnostics = validateNetworks(
    [first, second, segmentRecord, unaddressed],
    new Map([[9n, segment]]),
  );
  expect(diagnostics.map(({ file, pointer }) => [file, pointer])).toEqual([
    ["first.yaml", "/interfaces/0/addresses/0/cidr"],
    ["second.yaml", "/interfaces/0/macAddress"],
    ["segment.yaml", "/ipNetworks/0/gateway"],
    ["first.yaml", "/interfaces/0/addresses/1/dnsNames/1"],
  ]);
});

test("accepts an empty inventory", () => {
  expect(validateNetworks([], new Map())).toEqual([]);
});
