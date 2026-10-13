import fs from "node:fs";
import path from "node:path";

export function collectYamlFiles(target) {
  const stats = fs.statSync(target);
  if (stats.isDirectory()) {
    return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
      const entryPath = path.join(target, entry.name);
      if (entry.isDirectory()) return collectYamlFiles(entryPath);
      return entry.isFile() && /\.ya?ml$/iu.test(entry.name) ? [entryPath] : [];
    });
  }
  return stats.isFile() && /\.ya?ml$/iu.test(target) ? [target] : [];
}
