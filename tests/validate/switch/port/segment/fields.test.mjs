import { expect, test } from "@jest/globals";
import { switchPortSegmentFields } from "../../../../../src/validate/switch/port/segment/fields.mjs";

test("collects access, trunk, and PVID segment fields with pointers", () => {
  const record = {
    data: {
      switch: {
        ports: [{ segmentId: 2n }, { segmentIds: [3n, 4n], pvidSegmentId: 5n }, {}],
      },
    },
  };
  expect(switchPortSegmentFields(record)).toEqual([
    ["/switch/ports/0/segmentId", 2n],
    ["/switch/ports/1/segmentIds/0", 3n],
    ["/switch/ports/1/segmentIds/1", 4n],
    ["/switch/ports/1/pvidSegmentId", 5n],
  ]);
  expect(switchPortSegmentFields({ data: {} })).toEqual([]);
});
