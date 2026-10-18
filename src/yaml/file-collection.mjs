import fs from "node:fs";
import path from "node:path";

export function collectYamlFiles(target, fileSystem = fs) {
  const stats = fileSystem.statSync(target);
  if (stats.isDirectory()) {
    return fileSystem.readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
      const entryPath = path.join(target, entry.name);
      if (entry.isDirectory()) return collectYamlFiles(entryPath, fileSystem);
      return entry.isFile() && /\.ya?ml$/iu.test(entry.name) ? [entryPath] : [];
    });
  }
  return stats.isFile() && /\.ya?ml$/iu.test(target) ? [target] : [];
}
