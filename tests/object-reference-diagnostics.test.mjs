import { expect, test } from "@jest/globals";
import { objectReferenceDiagnostics } from "../src/object-reference-diagnostics.mjs";

test("reports references that are missing or have the wrong object kind", () => {
  const record = { file: "node.yaml", data: { id: 4n } };
  const entities = new Map([[2n, { kind: "network-segment" }]]);
  expect(
    objectReferenceDiagnostics(
      [
        [1n, "/missing", ["physical-machine"]],
        [2n, "/wrong-kind", ["virtual-machine"]],
        [3n, "/missing-kind", ["network-device"]],
      ],
      record,
      entities,
    ).map(({ message }) => message),
  ).toEqual([
    "Reference 1 resolves to no object. Expected physical-machine.",
    "Reference 2 resolves to network-segment. Expected virtual-machine.",
    "Reference 3 resolves to no object. Expected network-device.",
  ]);
});

test("accepts a reference with an allowed object kind", () => {
  expect(
    objectReferenceDiagnostics(
      [[1n, "/target", ["physical-machine"]]],
      { file: "node.yaml", data: { id: 4n } },
      new Map([[1n, { kind: "physical-machine" }]]),
    ),
  ).toEqual([]);
});

test("does not report a reference to an invalid target", () => {
  expect(
    objectReferenceDiagnostics(
      [[1n, "/target", ["physical-machine"]]],
      { file: "node.yaml", data: { id: 4n } },
      new Map([[1n, { kind: "physical-machine", invalid: true }]]),
    ),
  ).toEqual([]);
});
