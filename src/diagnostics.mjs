import diagnosticCode from "./validation/diagnostic-code.mjs";

export default function createDiagnostic(file, pointer, objectId, message, suggestion, code) {
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
