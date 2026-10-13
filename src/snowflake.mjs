import generate from "@eliware/snowflake";
import { parseSnowflakeArguments } from "./snowflake-arguments.mjs";

export function generateIds(
  args,
  { generateId = generate, write = console.log, error = console.error } = {},
) {
  const result = parseSnowflakeArguments(args);
  if (result.error !== undefined) {
    error(result.error);
    return 2;
  }
  for (let index = 0; index < result.count; index += 1) write(`${generateId()}\n`);
  return 0;
}
