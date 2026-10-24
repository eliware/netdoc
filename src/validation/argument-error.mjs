import { validationJson } from "./json-report.mjs";

export function reportValidationArgumentError(argumentResult, options = {}) {
  if (argumentResult.format === "json") {
    (options.write ?? console.log)(
      validationJson({
        exitCode: 2,
        error: argumentResult.error,
        errorCode: "NETDOC_ARGUMENTS_INVALID",
        fileCount: 0,
        diagnostics: [],
      }),
    );
  } else (options.error ?? console.error)(argumentResult.error);
  return 2;
}
