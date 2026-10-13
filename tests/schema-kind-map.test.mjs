import { expect, test } from "@jest/globals";
import { schemaByKind } from "../src/schema-kind-map.mjs";

test("maps each supported object kind to its schema file", () => {
  expect(schemaByKind).toEqual({
    "physical-machine": "physical-machine.schema.yaml",
    "virtual-machine": "virtual-machine.schema.yaml",
    "network-device": "network-device.schema.yaml",
    "network-segment": "network-segment.schema.yaml",
  });
});
