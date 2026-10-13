# AGENTS.md

## Project

This repository is `eliware/netdoc`.

## Scope and boundaries

Use README.md for project purpose, scope, and ownership.

## Layout

Use README.md and specs/README.md to find repository files.

## Development

Keep each source and test module focused on one responsibility.

## Validation

Use Node.js 26 or later and npm 12 or later.
Use native ESM for maintained JavaScript modules.
Run `npm test` for aggregate validation.
Run `npm run lint` for lint checks.
Run `npm run audit` for dependency checks.
Run `npm run format` to format files.
Run `npm run format:check` to check formatting.

## Security

Keep secrets, private data, and runtime state out of Git.

## Changes

Keep changes within this repository scope.
Get approval before external changes.

## Application

Use docs/ for end-user guidance.

## CLI

Use docs/cli-guide.md for command details.

## npm publication

Include specs/ in the package.
