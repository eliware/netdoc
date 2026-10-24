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
