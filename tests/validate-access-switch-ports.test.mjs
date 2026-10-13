import { expect, test } from "@jest/globals";
import { validateAccessSwitchPorts } from "../src/validate-access-switch-ports.mjs";

test("checks access port and interface segment agreement", () => {
  const record = {
    file: "switch.yaml",
    data: {
      id: 1n,
      interfaces: [{ name: "p1", segmentId: 2n }, { name: "p2" }],
      switch: {
        ports: [
          { interfaceName: "p1", mode: "access", segmentId: 3n },
          { interfaceName: "p2", mode: "access", segmentId: 4n },
          { interfaceName: "missing", mode: "access", segmentId: 5n },
          { interfaceName: "p1", mode: "trunk", segmentIds: [] },
        ],
      },
    },
  };
  expect(validateAccessSwitchPorts([record]).map(({ pointer }) => pointer)).toEqual([
    "/switch/ports/0/segmentId",
  ]);
  expect(validateAccessSwitchPorts([{ data: {} }])).toEqual([]);
});
