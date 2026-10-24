import { expect, jest, test } from "@jest/globals";
import path from "node:path";
import { createMemoryFileSystem } from "../../test-fixtures/memory-file-system.mjs";
import { reportInventoryFreshness } from "../../src/report/command.mjs";

test("reports stale records without failing validation", () => {
  const root = path.resolve("freshness-report-fixture");
  const file = path.join(root, "machine.yaml");
  const fileSystem = createMemoryFileSystem({
    [file]:
      'version: "11.0"\nkind: physical-machine\nname: server\nlastReviewed: "2026-10-01"\nroles: [server]\n',
  });
  const write = jest.spyOn(console, "log").mockImplementation(() => {});
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(
    reportInventoryFreshness([root, "--freshness", "--max-age-days", "7"], {
      fileSystem,
      now: new Date("2026-10-23T00:00:00Z"),
    }),
  ).toBe(0);
  expect(write.mock.calls[0][0]).toContain(
    "stale | freshness-report-fixture/machine.yaml | server | 2026-10-01 | 22",
  );
  expect(error).not.toHaveBeenCalled();
  write.mockRestore();
  error.mockRestore();
});

test("uses one date for freshness classification and the report heading", () => {
  const root = path.resolve("freshness-midnight-fixture");
  const file = path.join(root, "machine.yaml");
  const fileSystem = createMemoryFileSystem({
    [file]:
      'version: "11.0"\nkind: physical-machine\nname: server\nlastReviewed: "2026-10-23"\nroles: [server]\n',
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
  expect(write.mock.calls[0][0]).toContain("Review freshness as of 2026-10-23 UTC");
  expect(write.mock.calls[0][0]).toContain("current | freshness-midnight-fixture/machine.yaml");
});

test("rejects records without a review date", () => {
  const root = path.resolve("missing-review-date-fixture");
  const file = path.join(root, "machine.yaml");
  const fileSystem = createMemoryFileSystem({
    [file]: 'version: "11.0"\nkind: physical-machine\nname: server\nroles: [server]\n',
  });
  const error = jest.fn();

  expect(
    reportInventoryFreshness([root, "--freshness", "--max-age-days", "7"], {
      fileSystem,
      error,
    }),
  ).toBe(1);
  expect(error).toHaveBeenCalledWith(expect.stringContaining("lastReviewed"));
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
