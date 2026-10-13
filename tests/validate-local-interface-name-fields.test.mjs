import { expect, test } from "@jest/globals";
import { validateLocalInterfaceNameFields } from "../src/validate-local-interface-name-fields.mjs";

test("ignores fields with known or absent interface names", () => {
  const record = { file: "router.yaml", data: { id: 3n } };
  expect(
    validateLocalInterfaceNameFields(
      [
        ["/known", "eth0"],
        ["/empty", undefined],
      ],
      record,
      new Set(["eth0"]),
    ),
  ).toEqual([]);
});
