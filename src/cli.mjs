import { log as defaultLog } from "@eliware/common";

export function runCli(
  args,
  { version, log = defaultLog, write = console.log, validate, generateIds },
) {
  if (args.length === 0 || args[0] === "--help") {
    write("Usage: netdoc [--help] [--version] | validate <path> | --generate-id [-n COUNT]");
    return 0;
  }
  if (args.length === 1 && args[0] === "--version") {
    write(version);
    return 0;
  }
  if (args[0] === "validate") return validate(args.slice(1));
  if (args[0] === "--generate-id") return generateIds(args.slice(1));
  log.error(`Unknown argument: ${args[0]}`);
  return 2;
}
