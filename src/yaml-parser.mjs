import fs from "node:fs";
import YAML from "yaml";

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
