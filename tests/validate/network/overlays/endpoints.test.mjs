import { expect, test } from "@jest/globals";
import validateOverlayEndpointReferences from "../../../../src/validate/network/overlays/endpoints.mjs";

test("coordinates endpoint object and interface diagnostics", () => {
  const record = {
    file: "overlay.yaml",
    data: {
      encapsulation: {
        endpoints: [
          { nodeId: 1n, interfaceName: "missing" },
          { nodeId: 2n, interfaceName: "eth0" },
        ],
      },
    },
  };
  const entities = new Map([
    [1n, { kind: "virtual-machine", record: { data: { interfaces: [] } } }],
  ]);

  expect(validateOverlayEndpointReferences(record, entities).map(({ pointer }) => pointer)).toEqual(
    ["/encapsulation/endpoints/1/nodeId", "/encapsulation/endpoints/0/interfaceName"],
  );
});

test("accepts endpoints without named interfaces", () => {
  const record = {
    file: "overlay.yaml",
    data: { encapsulation: { endpoints: [{ nodeId: 3n }] } },
  };
  const entities = new Map([
    [3n, { kind: "virtual-machine", record: { data: { interfaces: [] } } }],
  ]);

  expect(validateOverlayEndpointReferences(record, entities)).toEqual([]);
  expect(validateOverlayEndpointReferences({ file: "plain.yaml", data: {} }, new Map())).toEqual(
    [],
  );
});
