import { expect, test } from "@jest/globals";
import validateWirelessReferenceChecks from "../../../src/validate/wireless/reference-checks.mjs";

test("coordinates wireless network and segment reference diagnostics", () => {
  const record = {
    file: "access-point.yaml",
    data: {
      interfaces: [
        {
          wireless: {
            role: "radio",
            broadcasts: [{ wirelessNetworkId: 1n, segmentId: 2n }],
          },
        },
      ],
    },
  };
  const diagnostics = validateWirelessReferenceChecks(record, new Map());
  expect(diagnostics.map(({ pointer }) => pointer)).toEqual([
    "/interfaces/0/wireless/broadcasts/0/wirelessNetworkId",
    "/interfaces/0/wireless/broadcasts/0/segmentId",
  ]);
});
