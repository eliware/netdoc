import { diagnosticCode } from "./validation/diagnostic-code.mjs";

export function createDiagnostic(file, pointer, objectId, message, suggestion, code) {
  return {
    code: code ?? diagnosticCode(message),
    severity: "error",
    file,
    pointer,
    objectId,
    message,
    suggestion,
  };
}

export function formatDiagnostic(diagnostic) {
  const location = diagnostic.pointer
    ? `${diagnostic.file}#${diagnostic.pointer}`
    : diagnostic.file;
  const object = diagnostic.objectId === undefined ? "" : ` [id=${diagnostic.objectId}]`;
  const suggestion = diagnostic.suggestion ? ` Suggestion: ${diagnostic.suggestion}` : "";
  return `ERROR ${location}${object}: ${diagnostic.message}.${suggestion}`;
}
