const usage = "Usage: netdoc graph <path> --format mermaid";

export function parseGraphArguments(args) {
  if (args.length === 3 && args[1] === "--format" && args[2] === "mermaid")
    return { path: args[0], format: args[2] };
  return { error: usage };
}
