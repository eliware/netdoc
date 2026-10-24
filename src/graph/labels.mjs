export function escapeMermaidText(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("|", "&#124;")
    .replaceAll("[", "&#91;")
    .replaceAll("]", "&#93;")
    .replaceAll("(", "&#40;")
    .replaceAll(")", "&#41;")
    .replace(/[\r\n]+/g, " ");
}

export function nodeLine(nodeId, label) {
  return `${nodeId}["${label.map(escapeMermaidText).join("<br/>")}"]`;
}

export function edgeLine(from, to, label, arrow = "-->") {
  return `${from} ${arrow}|${escapeMermaidText(label)}| ${to}`;
}
