const usage = "Usage: netdoc validate <yaml-file-or-directory> [--format text|json]";

export function validateInventoryArguments(args) {
  if (args.length === 1) return { path: args[0], format: "text" };
  if (args.length === 3 && args[1] === "--format" && ["text", "json"].includes(args[2]))
    return { path: args[0], format: args[2] };
  return {
    format: args.at(-1) === "json" ? "json" : "text",
    error: usage,
  };
}
