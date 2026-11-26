import escapeMermaidText from "./labels.mjs";

export default function nodeLine(nodeId, label) {
  return `${nodeId}["${label.map(escapeMermaidText).join("<br/>")}"]`;
}
