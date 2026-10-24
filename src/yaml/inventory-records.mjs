import path from "node:path";
import { createDiagnostic } from "../diagnostics.mjs";
import { parseYamlFile } from "./parser.mjs";

export function parseInventoryRecords(files, { cwd, fileSystem }) {
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
  return { records, diagnostics };
}
