const usage = "Usage: netdoc ansible inventory --list | --host <inventory-hostname>";

export default function parseAnsibleInventoryArguments(args) {
  if (args.length === 2 && args[0] === "inventory" && args[1] === "--list") return { mode: "list" };
  if (
    args.length === 3 &&
    args[0] === "inventory" &&
    args[1] === "--host" &&
    typeof args[2] === "string" &&
    args[2].length > 0
  )
    return { mode: "host", hostname: args[2] };
  return { error: usage };
}
