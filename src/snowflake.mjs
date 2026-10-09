import generate from "@eliware/snowflake";

export function generateIds(
  args,
  { generateId = generate, write = console.log, error = console.error } = {},
) {
  let count = 1;
  if (args.length > 0) {
    if (args.length !== 2 || args[0] !== "-n" || !/^[1-9][0-9]*$/u.test(args[1])) {
      error("Usage: netdoc --generate-id [-n COUNT]");
      return 2;
    }
    count = Number(args[1]);
    if (!Number.isSafeInteger(count)) {
      error("COUNT must be a positive safe integer.");
      return 2;
    }
  }
  for (let index = 0; index < count; index += 1) write(`${generateId()}\n`);
  return 0;
}
