import { expect, test } from "@jest/globals";
import { validateLocalInterfaceNameFields } from "../src/validate-local-interface-name-fields.mjs";

test("reports fields that name unknown interfaces", () => {
  const record = { file: "router.yaml", data: { id: 3n } };
  expect(
    validateLocalInterfaceNameFields(
      [
        ["/known", "eth0"],
        ["/missing", "eth9"],
        ["/empty", undefined],
      ],
      record,
      new Set(["eth0"]),
    ),
  ).toMatchObject([{ pointer: "/missing", objectId: 3n }]);
});
