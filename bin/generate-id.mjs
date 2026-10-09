#!/usr/bin/env node
import { generateIds } from "../src/snowflake.mjs";
process.exitCode = generateIds(process.argv.slice(2), {
  write: (text) => process.stdout.write(text),
});
