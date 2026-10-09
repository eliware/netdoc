export function createDiagnostic(file, pointer, objectId, message, suggestion) {
  return { severity: "error", file, pointer, objectId, message, suggestion };
}

export function formatDiagnostic(diagnostic) {
  const location = diagnostic.pointer
    ? `${diagnostic.file}#${diagnostic.pointer}`
    : diagnostic.file;
  const object = diagnostic.objectId === undefined ? "" : ` [id=${diagnostic.objectId}]`;
  const suggestion = diagnostic.suggestion ? ` Suggestion: ${diagnostic.suggestion}` : "";
  return `ERROR ${location}${object}: ${diagnostic.message}.${suggestion}`;
}
