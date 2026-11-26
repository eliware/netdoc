import escapeMermaidText from "./labels.mjs";

export default function edgeLine(from, to, label, arrow = "-->") {
  return `${from} ${arrow}|${escapeMermaidText(label)}| ${to}`;
}
