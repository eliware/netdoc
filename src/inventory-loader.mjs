import fs from "node:fs";
import path from "node:path";
import { createDiagnostic } from "./diagnostics.mjs";
import { collectYamlFiles, parseYamlFile } from "./yaml-files.mjs";

export function loadInventory(target, { cwd = process.cwd() } = {}) {
  if (typeof target !== "string" || target.length === 0) {
    throw new Error(`Path does not exist: ${target}`);
  }
  const absoluteTarget = path.resolve(cwd, target);
  if (!fs.existsSync(absoluteTarget)) {
    throw new Error(`Path does not exist: ${absoluteTarget}`);
  }
  const files = collectYamlFiles(absoluteTarget).sort();
  if (files.length === 0) {
    throw new Error(`No YAML files found: ${absoluteTarget}`);
  }
  const records = [];
  const diagnostics = [];
  for (const file of files) {
    const relativeFile = path.relative(cwd, file);
    try {
      const data = parseYamlFile(file, true);
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        diagnostics.push(
          createDiagnostic(
            relativeFile,
            "",
            undefined,
            "The YAML document must contain one object.",
            "Use a mapping with version, kind, and name fields.",
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
          "Fix the YAML syntax and remove duplicate keys or extra documents.",
        ),
      );
    }
  }
  return { records, diagnostics, fileCount: files.length };
}
