import generate from '@eliware/snowflake';

const args = process.argv.slice(2);
let count = 1;

if (args.length > 0) {
  if (args.length !== 2 || args[0] !== '-n' || !/^[1-9][0-9]*$/.test(args[1])) {
    process.stderr.write('Usage: node bin/generate-id.mjs [-n COUNT]\n');
    process.exit(2);
  }

  count = Number(args[1]);
  if (!Number.isSafeInteger(count)) {
    process.stderr.write('COUNT must be a positive safe integer.\n');
    process.exit(2);
  }
}

for (let index = 0; index < count; index += 1) {
  process.stdout.write(`${generate()}\n`);
}
