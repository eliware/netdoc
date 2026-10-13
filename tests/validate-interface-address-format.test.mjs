import { expect, test } from "@jest/globals";
import { validateInterfaceAddressFormat } from "../src/validate-interface-address-format.mjs";

test("returns parsed addresses and reports invalid values", () => {
  const record = { file: "node.yaml", data: { id: 7n } };
  expect(validateInterfaceAddressFormat("192.0.2.1/24", record, "/address").parsed.version).toBe(4);
  expect(validateInterfaceAddressFormat("bad", record, "/address").diagnostic).toMatchObject({
    file: "node.yaml",
    pointer: "/address",
    objectId: 7n,
    message: "Invalid IP address or prefix 'bad'.",
  });
});
