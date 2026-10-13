import { expect, test } from "@jest/globals";
import { validateAnnouncementInterfaceReferences } from "../src/validate-announcement-interface-references.mjs";

test("checks announcement interface names on referenced objects", () => {
  const record = {
    file: "cilium.yaml",
    data: {
      id: 2n,
      networking: {
        l2Announcements: [
          { nodeId: 1n, interfaceName: "eth0" },
          { nodeId: 3n, interfaceName: "eth1" },
        ],
      },
    },
  };
  const entities = new Map([[1n, { record: { data: { interfaces: [{ name: "eth0" }] } } }]]);
  entities.set(4n, { invalid: true });
  record.data.networking.l2Announcements.push({ nodeId: 4n, interfaceName: "bad" });
  expect(
    validateAnnouncementInterfaceReferences(record, entities).map(({ message }) => message),
  ).toEqual(["Interface name 'eth1' does not exist on the referenced object."]);
  expect(validateAnnouncementInterfaceReferences({ data: {} }, new Map())).toEqual([]);
});
