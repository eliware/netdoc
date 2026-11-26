const usage = "Usage: netdoc ansible <path> (--list | --host <inventory-hostname>)";

export default function parseAnsibleInventoryArguments(args) {
  if (typeof args[0] !== "string" || args[0].length === 0) return { error: usage };
  if (args.length === 2 && args[1] === "--list") return { inventoryPath: args[0], mode: "list" };
  if (
    args.length === 3 &&
    args[1] === "--host" &&
    typeof args[2] === "string" &&
    args[2].length > 0
  )
    return { inventoryPath: args[0], mode: "host", hostname: args[2] };
  return { error: usage };
}
