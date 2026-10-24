# AGENTS.md

## Project

See README.md for repository purpose, ownership, and scope.

## Scope and boundaries

Keep requirements in their authoritative specifications.

## Layout

Use README.md and specs/README.md to find repository files.

## Development

Keep each source and test module focused on one responsibility.

## Validation

Use Node.js 26 or later and native ESM for maintained JavaScript modules.

Run npm test for aggregate validation.
Run npm run lint for lint checks.
Run npm run audit for dependency checks.
Run npm run format to format files.
Run npm run format:check to check formatting.

## Security

Keep credentials, secret values, private data, and runtime state out of Git.

## Changes

Keep contribution rules in specs/.

## Application

Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## CLI

Keep `--help` and `--version` read-only.
Document each command, option, argument, default, error, and exit code.

## npm publication

Use `.github/workflows/npm.yaml` for package publication.
Follow the approved release process before you publish.
