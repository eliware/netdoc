import { expect, jest, test } from "@jest/globals";
import path from "node:path";
import { createMemoryFileSystem } from "../../test-fixtures/memory-file-system.mjs";
import { reportInventoryFreshness } from "../../src/report/command.mjs";

test("reports stale evidence without failing validation", () => {
  const root = path.resolve("freshness-report-fixture");
  const file = path.join(root, "machine.yaml");
  const fileSystem = createMemoryFileSystem({
    [file]:
      'version: "11.0"\nkind: physical-machine\nname: server\nroles: [server]\nevidence:\n  - source: inventory\n    basis: observed\n    checkedOn: "2026-10-01"\n',
  });
  const write = jest.spyOn(console, "log").mockImplementation(() => {});
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(
    reportInventoryFreshness([root, "--freshness", "--max-age-days", "7"], {
      fileSystem,
      now: new Date("2026-10-23T00:00:00Z"),
    }),
  ).toBe(0);
  expect(write.mock.calls[0][0]).toContain("stale | freshness-report-fixture/machine.yaml");
  expect(error).not.toHaveBeenCalled();
  write.mockRestore();
  error.mockRestore();
});

test("reports command argument errors", () => {
  const error = jest.fn();
  expect(reportInventoryFreshness(["inventory"], { error })).toBe(2);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("--max-age-days DAYS"));
});

test("reports setup and inventory errors", () => {
  const error = jest.fn();
  expect(
    reportInventoryFreshness(["missing-freshness-path", "--freshness", "--max-age-days", "1"], {
      error,
    }),
  ).toBe(2);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("Path does not exist"));
  const root = path.resolve("freshness-invalid-fixture");
  const file = path.join(root, "machine.yaml");
  const fileSystem = createMemoryFileSystem({
    [file]: "name: [broken\n",
  });
  error.mockClear();
  expect(
    reportInventoryFreshness([root, "--freshness", "--max-age-days", "1"], {
      error,
      fileSystem,
    }),
  ).toBe(1);
  expect(error).toHaveBeenCalled();
});

test("uses the default error output for invalid arguments", () => {
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(reportInventoryFreshness(["inventory"])).toBe(2);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("Usage: netdoc report"));
  error.mockRestore();
});
