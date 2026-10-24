import fs from "node:fs";
import path from "node:path";
import { collectYamlFiles } from "./yaml/file-collection.mjs";
import { parseInventoryRecords } from "./yaml/inventory-records.mjs";

export function loadInventory(target, { cwd = process.cwd(), fileSystem = fs } = {}) {
  if (typeof target !== "string" || target.length === 0) {
    throw new Error(`Path does not exist: ${target}`);
  }
  const absoluteTarget = path.resolve(cwd, target);
  if (!fileSystem.existsSync(absoluteTarget)) {
    throw new Error(`Path does not exist: ${absoluteTarget}`);
  }
  const files = collectYamlFiles(absoluteTarget, fileSystem).sort();
  if (files.length === 0) {
    throw new Error(`No YAML files found: ${absoluteTarget}`);
  }
  const { records, diagnostics } = parseInventoryRecords(files, { cwd, fileSystem });
  return { records, diagnostics, fileCount: files.length };
}

export function tryLoadInventory(target, options) {
  try {
    return { inventory: loadInventory(target, options) };
  } catch (cause) {
    return { error: cause.message };
  }
}
