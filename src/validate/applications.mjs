import createDiagnostic from "../diagnostics.mjs";

export default function validateApplications(record) {
  const seen = new Set();
  const diagnostics = [];
  (record.data.applications ?? []).forEach((application, index) => {
    if (!seen.has(application.name)) {
      seen.add(application.name);
      return;
    }
    diagnostics.push(
      createDiagnostic(
        record.file,
        `/applications/${index}/name`,
        record.data.id,
        `Application name '${application.name}' is repeated.`,
        "Use a unique name for each declared application.",
      ),
    );
  });
  return diagnostics;
}
