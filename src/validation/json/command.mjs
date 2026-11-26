import validationJson from "./report.mjs";

export default function reportValidationJson(result, { write = console.log } = {}) {
  write(validationJson(result));
  return result.exitCode;
}
