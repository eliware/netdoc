const maximumCount = 1000;

export function parseSnowflakeArguments(args) {
  if (args.length === 0) return { count: 1 };
  if (args.length !== 2 || args[0] !== "-n" || !/^[1-9][0-9]*$/u.test(args[1]))
    return { error: "Usage: netdoc --generate-id [-n COUNT]" };
  const count = Number(args[1]);
  if (!Number.isSafeInteger(count) || count > maximumCount)
    return { error: `COUNT must be an integer from 1 through ${maximumCount}.` };
  return { count };
}
