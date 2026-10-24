import { expect, test } from "@jest/globals";
import { createGraphContext } from "../../src/graph/context.mjs";
import { buildResidencyEdges } from "../../src/graph/residency.mjs";

test("links resident virtual machines and network devices to known hosts", () => {
  const host = { data: { kind: "physical-machine", id: 1n } };
  const virtualMachine = { data: { kind: "virtual-machine", id: 2n, residentOn: 1n } };
  const networkDevice = { data: { kind: "network-device", id: 3n, residentOn: [1n, 99n] } };
  const otherDevice = { data: { kind: "network-device", id: 4n } };
  const unplacedMachine = { data: { kind: "virtual-machine", id: 5n } };
  expect(
    buildResidencyEdges(
      createGraphContext([host, virtualMachine, networkDevice, otherDevice, unplacedMachine]),
    ),
  ).toEqual(["object_1 -.->|runs on| object_0", "object_2 -.->|runs on| object_0"]);
});
