#!/usr/bin/env node
import packageJson from "../package.json" with { type: "json" };
import { runCli } from "../src/cli.mjs";
import { generateIds } from "../src/snowflake.mjs";
import { validateInventory } from "../src/validator.mjs";

process.exitCode = runCli(process.argv.slice(2), {
  version: packageJson.version,
  write: (text) => process.stdout.write(`${text}\n`),
  validate: (args) => validateInventory(args),
  generateIds: (args) => generateIds(args, { write: (text) => process.stdout.write(text) }),
});
