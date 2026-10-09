# AGENTS.md

## Project

Repository: `eliware/netdoc`. Purpose: provide a read-only validator and Snowflake ID generator for NetDoc infrastructure records.

## Scope and boundaries

Scope: this repository owns NetDoc schemas and CLI software. Boundary: it excludes inventory records, credentials, and infrastructure changes. These instructions apply repository-wide; a closer `AGENTS.md` file applies within its subdirectory.

## Layout

Required structure: `bin/netdoc.mjs` is the executable entrypoint. `src/` contains implementation and `tests/` mirrors it. `docs/schema/` contains schemas. `docs/` contains user guidance. `specs/` contains repository directives.

## Development

Before changing files, read the root README.md, applicable AGENTS.md instructions, applicable documentation, specifications, implementation, and tests. These instructions apply repository-wide; closer AGENTS.md files apply to subdirectories.

Use Node.js 26, npm, and native ESM `.mjs` modules. Runtime environment settings: none. The CLI accepts arguments. Package metadata is not runtime configuration.

Define single responsibility as one cohesive purpose and one reason to change. Business-logic modules and coordinators are valid, including coordinators of coordinators, when each module has one responsibility. Put each distinct responsibility in a focused submodule with a mirrored test. Wire it through its owner. Do not add the new responsibility to an existing module. Refactor them when you find mixed responsibilities during ordinary review. Line counts do not establish single responsibility. Passing them does not prove cohesion or permit mixed responsibilities.

## Validation

Run `npm ci` after dependency changes. Run `npm test` before handoff. Run `npm run pack` to validate package contents. Require a passing result. Run `node bin/netdoc.mjs validate <path>` to validate YAML records.

## Security

Do not store credentials, secrets, or private machine-specific paths in this repository. Never commit machine-specific paths. Do not expose secrets in diagnostics. The validator reads files. ID generation prints IDs to standard output.

## Changes

Keep changes actionable, current, and concise. A documented project-specific deviation does not waive a convention or validation stage. Project-specific requirements must not weaken shared rules. Do not publish, release, deploy, or modify external systems without explicit authorization through the Operations release handoff.

## Application

The actual runtime entrypoint is `bin/netdoc.mjs`. Its lifecycle is a short local command, with startup on invocation and shutdown on exit. The CLI validates input before schema checks. It opens no network connections. It has no persistent state or runtime configuration. Its safe, read-only operational boundary limits commands to local reads and ID output.

## CLI

The executable entrypoint is `bin/netdoc.mjs`; it targets `src/cli.mjs`. The command is `netdoc`. It supports `--help`, `--version`, `validate <path>`, and `--generate-id [-n COUNT]`. Validation requires one YAML file or directory and forwards that path to the validator. ID generation prints one ID by default; `-n COUNT` requires a positive safe integer. Invalid arguments return exit code 2. Schema errors return exit code 1. Successful commands return exit code 0. No command changes or deletes state, so dry-run and confirmation controls do not apply. Supported platforms: Windows, macOS, and Linux. Validation evidence: Ubuntu is directly validated by GitHub Actions CI; Windows and macOS are not yet directly validated.

## npm publication

Package identity: `@eliware/netdoc`. Version source: `package.json.version`. The exact package files allowlist is `src/`, `docs/`, `README.md`, `AGENTS.md`, `LICENSE`, `RELEASE_NOTES.md`, and `bin/`. Run `npm run pack` (`eliware-test --pack`); require a passing result. Use npm Trusted Publishing with provenance. Verify that the exact version for `@eliware/netdoc` is visible at `registry.npmjs.org`. Eli and the project developer run TagIt preflight together. Eli decides whether the release is ready and instructs DevOps. DevOps executes the authorized release. Publication requires explicit authorization through the Operations release handoff. This guidance does not authorize publication.
