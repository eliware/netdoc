import { expect, test } from "@jest/globals";
import { runValidationPipeline } from "../src/validation-pipeline.mjs";

test("runs relationship checks when other records have schema errors", () => {
  const records = [
    {
      file: "router.yaml",
      data: {
        kind: "network-device",
        id: 1n,
        interfaces: [{ name: "eth0", segmentId: 99n }],
      },
    },
  ];
  const initialDiagnostics = [{ file: "broken.yaml", message: "Schema error" }];
  const diagnostics = runValidationPipeline({
    inventoryRecords: records,
    validRecords: records,
    initialDiagnostics,
  });
  expect(diagnostics).toEqual(
    expect.arrayContaining([
      initialDiagnostics[0],
      expect.objectContaining({ message: "Reference 99 does not resolve to a network-segment." }),
    ]),
  );
});

test("runs within-record checks when IDs conflict", () => {
  const records = [
    {
      file: "first.yaml",
      data: {
        kind: "network-device",
        id: 1n,
        networking: { routing: { defaultGateway: "bad" } },
      },
    },
    { file: "second.yaml", data: { kind: "network-device", id: 1n } },
  ];
  const diagnostics = runValidationPipeline({
    inventoryRecords: records,
    validRecords: records,
    initialDiagnostics: [],
  });
  expect(diagnostics).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ message: expect.stringContaining("already used") }),
      expect.objectContaining({
        message: expect.stringContaining("Invalid IP address or network 'bad'."),
      }),
    ]),
  );
});
