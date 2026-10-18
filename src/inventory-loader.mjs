import fs from "node:fs";
import path from "node:path";
import { createDiagnostic } from "./diagnostics.mjs";
import { collectYamlFiles } from "./yaml/file-collection.mjs";
import { parseYamlFile } from "./yaml/parser.mjs";

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
  const records = [];
  const diagnostics = [];
  for (const file of files) {
    const relativeFile = path.relative(cwd, file);
    try {
      const data = parseYamlFile(file, true, fileSystem);
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        diagnostics.push(
          createDiagnostic(
            relativeFile,
            "",
            undefined,
            "The YAML document must contain one object.",
            "Use a mapping with version, object type, and name fields.",
          ),
        );
        continue;
      }
      records.push({ file: relativeFile, absoluteFile: file, data });
    } catch (cause) {
      diagnostics.push(
        createDiagnostic(
          relativeFile,
          "",
          undefined,
          `YAML parse error: ${cause.message}`,
          "Correct the YAML syntax, remove duplicate keys, and keep one YAML document.",
        ),
      );
    }
  }
  return { records, diagnostics, fileCount: files.length };
}

export function tryLoadInventory(target, options) {
  try {
    return { inventory: loadInventory(target, options) };
  } catch (cause) {
    return { error: cause.message };
  }
}
