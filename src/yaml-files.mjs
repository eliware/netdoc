import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

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

export function parseYamlFile(file, intAsBigInt = false) {
  const documents = YAML.parseAllDocuments(fs.readFileSync(file, "utf8"), {
    intAsBigInt,
    uniqueKeys: true,
  });
  const errors = documents.flatMap((document) => document.errors);
  if (errors.length > 0) {
    throw new Error(errors.map((error) => error.message).join("; "));
  }
  if (documents.length !== 1) {
    throw new Error(`Expected one YAML document, found ${documents.length}.`);
  }
  return documents[0].toJS();
}

export function convertBigIntsForValidation(value) {
  if (typeof value === "bigint") return Number(value);
  if (Array.isArray(value)) return value.map(convertBigIntsForValidation);
  if (value && typeof value === "object" && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, convertBigIntsForValidation(item)]),
    );
  }
  return value;
}
