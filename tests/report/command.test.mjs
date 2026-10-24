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

test("uses one date for freshness classification and the report heading", () => {
  const root = path.resolve("freshness-midnight-fixture");
  const file = path.join(root, "machine.yaml");
  const fileSystem = createMemoryFileSystem({
    [file]:
      'version: "11.0"\nkind: physical-machine\nname: server\nroles: [server]\nevidence:\n  - source: inventory\n    basis: observed\n    checkedOn: "2026-10-23"\n',
  });
  const NativeDate = globalThis.Date;
  const dates = ["2026-10-23T23:59:59.000Z", "2026-10-24T00:00:01.000Z"];
  let currentDateIndex = 0;
  const write = jest.fn();
  let exitCode;
  try {
    globalThis.Date = class extends NativeDate {
      constructor(...args) {
        super(...(args.length === 0 ? [dates[currentDateIndex++]] : args));
      }
    };
    exitCode = reportInventoryFreshness([root, "--freshness", "--max-age-days", "1"], {
      fileSystem,
      write,
      error: jest.fn(),
    });
  } finally {
    globalThis.Date = NativeDate;
  }
  expect(exitCode).toBe(0);
  expect(currentDateIndex).toBe(1);
  expect(write.mock.calls[0][0]).toContain("Evidence freshness as of 2026-10-23 UTC");
  expect(write.mock.calls[0][0]).toContain("current | freshness-midnight-fixture/machine.yaml");
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
