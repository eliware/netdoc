# AGENTS.md

## Project

This repository contains the NetDoc command-line tool and schemas.

## Scope and boundaries

Use README.md for project purpose, scope, and ownership.

## Layout

Use README.md and specs/README.md to find repository files.

## Development

Keep each source and test module focused on one responsibility.

## Validation

Use Node.js 26 or later and npm 12 or later.
Use native ESM for maintained JavaScript modules.
Run `npm test` for aggregate checks.
Run `npm run lint` for lint checks.
Run `npm run audit` for dependency checks.

Run `npm run format` to format files.
Run `npm run format:check` to check formatting.

## Security

Keep secrets, private data, and runtime state out of Git.

## Changes

Keep changes in this repository.
Receive Eliware Operations approval before you change an external system.

## Application

Document entry points, workflows, settings, startup, and shutdown in README.md.
Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## CLI

Document each command, option, argument, default, error, and exit code in docs/cli-guide.md.

## npm publication

Include specs/ in the package.
