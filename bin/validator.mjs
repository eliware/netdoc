import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import YAML from 'yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const schemaDirectory = fileURLToPath(new URL('../schema/', import.meta.url));
const schemaFiles = [
  'physical-machine.schema.yaml',
  'virtual-machine.schema.yaml',
  'network-device.schema.yaml',
  'network-segment.schema.yaml',
];
const schemaByKind = {
  'physical-machine': 'physical-machine.schema.yaml',
  'virtual-machine': 'virtual-machine.schema.yaml',
  'network-device': 'network-device.schema.yaml',
  'network-segment': 'network-segment.schema.yaml',
};

function reportUsage() {
  console.error('Usage: node bin/validator.mjs <yaml-file-or-directory>');
  process.exit(2);
}

function collectYamlFiles(target) {
  const stats = fs.statSync(target);
  if (stats.isFile()) {
    return /\.ya?ml$/i.test(target) ? [target] : [];
  }
  if (!stats.isDirectory()) return [];

  return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(target, entry.name);
    if (entry.isDirectory()) return collectYamlFiles(entryPath);
    return entry.isFile() && /\.ya?ml$/i.test(entry.name) ? [entryPath] : [];
  });
}

function parseYaml(file, intAsBigInt = false) {
  const document = YAML.parseDocument(fs.readFileSync(file, 'utf8'), {
    intAsBigInt,
    uniqueKeys: true,
  });
  if (document.errors.length > 0) {
    throw new Error(document.errors.map((error) => error.message).join('; '));
  }
  return document.toJS();
}

function convertBigIntsForAjv(value) {
  // Ajv validates JavaScript numbers. Keep parsed BigInts intact in the source data.
  if (typeof value === 'bigint') return Number(value);
  if (Array.isArray(value)) return value.map(convertBigIntsForAjv);
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, convertBigIntsForAjv(item)]),
    );
  }
  return value;
}

function loadValidators() {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);

  for (const name of ['common.schema.yaml', ...schemaFiles]) {
    const file = path.join(schemaDirectory, name);
    const schema = parseYaml(file);
    ajv.addSchema(schema, pathToFileURL(file).href);
  }

  return Object.fromEntries(
    Object.entries(schemaByKind).map(([kind, name]) => {
      const file = path.join(schemaDirectory, name);
      const validate = ajv.getSchema(pathToFileURL(file).href);
      if (!validate) throw new Error(`Could not compile schema: ${name}`);
      return [kind, validate];
    }),
  );
}

if (process.argv.length !== 3) reportUsage();

const target = path.resolve(process.argv[2]);
if (!fs.existsSync(target)) {
  console.error(`Path does not exist: ${target}`);
  process.exit(2);
}

let validators;
try {
  validators = loadValidators();
} catch (error) {
  console.error(`Could not load schemas: ${error.message}`);
  process.exit(2);
}

const files = collectYamlFiles(target).sort();
if (files.length === 0) {
  console.error(`No YAML files found: ${target}`);
  process.exit(2);
}

let errorCount = 0;
for (const file of files) {
  const relativeFile = path.relative(process.cwd(), file);
  let data;
  try {
    data = parseYaml(file, true);
  } catch (error) {
    console.error(`${relativeFile}: YAML parse error: ${error.message}`);
    errorCount += 1;
    continue;
  }

  const validate = data && typeof data === 'object' ? validators[data.kind] : undefined;
  if (!validate) {
    console.error(`${relativeFile}: missing or unsupported object kind`);
    errorCount += 1;
    continue;
  }

  if (!validate(convertBigIntsForAjv(data))) {
    for (const error of validate.errors ?? []) {
      console.error(`${relativeFile}${error.instancePath || '/'}: ${error.message}`);
      errorCount += 1;
    }
  }
}

if (errorCount > 0) {
  console.error(`Found ${errorCount} error(s) in ${files.length} YAML file(s).`);
  process.exit(1);
}

console.log(`Validated ${files.length} YAML file(s).`);
