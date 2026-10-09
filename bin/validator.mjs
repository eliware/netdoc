#!/usr/bin/env node
import { validateInventory } from "../src/validator.mjs";
process.exitCode = validateInventory(process.argv.slice(2));
