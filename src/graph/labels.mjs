function escapeMermaidText(value) {
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
    .replaceAll("{", "&#123;")
    .replaceAll("}", "&#125;")
    .replaceAll("`", "&#96;")
    .replaceAll("%", "&#37;")
    .replace(/[\r\n]+/g, " ");
}

export default escapeMermaidText;
