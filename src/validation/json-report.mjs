export function validationJson(result) {
  const output = {
    status: result.exitCode === 0 ? "passed" : result.exitCode === 1 ? "failed" : "error",
    summary: { files: result.fileCount, errors: result.diagnostics.length },
    diagnostics: result.diagnostics.map(({ code, file, pointer, message, suggestion }) => ({
      code,
      file: file.replaceAll("\\", "/"),
      pointer,
      message,
      ...(suggestion ? { suggestion } : {}),
    })),
  };
  if (result.error !== undefined)
    output.error = { code: result.errorCode ?? "NETDOC_SETUP_ERROR", message: result.error };
  return JSON.stringify(output);
}
