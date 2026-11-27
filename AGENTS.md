# AGENTS.md

## Project

NetDoc validates network and system inventory. Read README.md for user workflows.

## Scope and boundaries

Keep inventory requirements in specs/.

## Layout

Keep implementation in src/, launchers in bin/, and tests in tests/.

## Development

Use Node.js 26 or later and native ESM for maintained JavaScript modules.

## Validation

Run npm test for aggregate validation.
Run npm run lint for lint checks.
Run npm run audit for dependency checks.
Run npm run format to format files.
Run npm run format:check to check formatting.

## Security

Keep credentials, secrets, and private data out of Git.

## Changes

Update docs/ when user-visible behavior changes.

## Application

Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## CLI

Keep `--help` and `--version` read-only.
Keep command help and docs aligned with command behavior.

## npm publication

Use .github/workflows/npm.yaml for package publication.
Follow the approved release process before publication.
