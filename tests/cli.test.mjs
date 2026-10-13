import { expect, jest, test } from "@jest/globals";
import { runCli } from "../src/cli.mjs";

const handlers = () => ({ validate: jest.fn(() => 0), generateIds: jest.fn(() => 0) });

test.each([{ args: [] }, { args: ["--help"] }])("shows usage", ({ args }) => {
  const write = jest.fn();
  expect(runCli(args, { ...handlers(), version: "11.0.0", write })).toBe(0);
  expect(write).toHaveBeenCalledWith(
    "Usage: netdoc [--help] [--version] | validate <path> | --generate-id [-n COUNT]",
  );
});

test("prints the package version", () => {
  const write = jest.fn();
  expect(runCli(["--version"], { ...handlers(), version: "11.0.0", write })).toBe(0);
  expect(write).toHaveBeenCalledWith("11.0.0");
});

test("forwards validation arguments to its command", () => {
  const commands = handlers();
  expect(runCli(["validate", "records"], { ...commands, version: "11.0.0" })).toBe(0);
  expect(commands.validate).toHaveBeenCalledWith(["records"]);
});

test("forwards ID options to its command", () => {
  const commands = handlers();
  expect(runCli(["--generate-id", "-n", "3"], { ...commands, version: "11.0.0" })).toBe(0);
  expect(commands.generateIds).toHaveBeenCalledWith(["-n", "3"]);
});

test("reports unknown commands and returns the usage error code", () => {
  const log = { error: jest.fn() };
  const commands = handlers();
  expect(runCli(["unknown"], { ...commands, version: "11.0.0", log })).toBe(2);
  expect(log.error).toHaveBeenCalledWith("Unknown argument: unknown");
  expect(commands.validate).not.toHaveBeenCalled();
  expect(commands.generateIds).not.toHaveBeenCalled();
});
