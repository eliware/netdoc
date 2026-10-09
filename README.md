# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

@eliware/netdoc [![npm](https://img.shields.io/npm/v/@eliware/netdoc)](https://www.npmjs.com/package/@eliware/netdoc) [![License](https://img.shields.io/github/license/eliware/netdoc)](https://github.com/eliware/netdoc/blob/main/LICENSE) [![CI](https://github.com/eliware/netdoc/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/netdoc/actions/workflows/ci.yaml)

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Configuration](#configuration)
- [Operations](#operations)
- [Commands](#commands)
- [Exit codes](#exit-codes)
- [Support](#support)
- [License](#license)
- [Links](#links)

## Features

NetDoc provides read-only validation for infrastructure YAML and generates unique Snowflake IDs. It owns the schemas and CLI. Inventory records belong in `netdoc-config`.

Package description: Git-versioned model for documenting network infrastructure, systems, services, and their relationships. Author: Eliware <eliware@eliware.org>. License: MIT.

The CLI checks YAML syntax, object schemas, BIGINT IDs, object references, reciprocal links, IP assignments, segment networks, and IP values. It does not edit records or connect to a network.

## Requirements

Use Node.js 26 and npm. Supported platforms: Windows, macOS, and Linux. Validation evidence: Ubuntu is directly validated by GitHub Actions CI; Windows and macOS are not yet directly validated.

## Setup

Install the public package with `npm install -g @eliware/netdoc`. The executable entrypoint is `bin/netdoc.mjs`, and the command is `netdoc`. The release version comes from `package.json.version`; do not assume an unreleased version is available. Run `npm ci` in a checkout to install development dependencies.

## Usage

Run `netdoc --help` to show available commands. Run `netdoc validate <path>` to check a YAML file or directory. Run `netdoc --generate-id` to print one ID.

## Development

Read [AGENTS.md](AGENTS.md), [docs/README.md](docs/README.md), and [specs/README.md](specs/README.md) before making changes.

Documentation: [docs](docs/README.md) · [specifications](specs/README.md)

## Testing

Run `npm test` for Jest with 100% coverage, lint, formatting, audit, package checks, and profile checks through `eliware-test`. Run `npm run pack` to check package contents. CI runs `npm ci` followed by `npm test`.

## Troubleshooting

If `netdoc` is not found, confirm Node.js 26 is installed and the global npm path is available. Run `npm test` to validate a checkout. Use the file or directory path required by `validate`.

## Security

The validator reads YAML and reports errors. ID generation prints to standard output. Do not store credentials in inventory or expose secrets in diagnostics.

## Configuration

No runtime configuration exists. The CLI has no runtime settings or environment variables. Package metadata and workflow files are not runtime configuration.

## Operations

Startup occurs when a user runs a command. Shutdown occurs after the command exits. Observable workflows are local validation diagnostics and generated IDs on standard output. Operational boundaries exclude file writes, network connections, and changes to external systems.

## Commands

| Command                     | Behavior                                        |
| --------------------------- | ----------------------------------------------- |
| `netdoc --help`             | Print help and exit with code 0.                |
| `netdoc --version`          | Print the package version and exit with code 0. |
| `netdoc validate <path>`    | Validate YAML files in a file or directory.     |
| `netdoc --generate-id`      | Print one Snowflake ID.                         |
| `netdoc --generate-id -n 3` | Print three Snowflake IDs.                      |

Validation does not edit input files. ID generation does not write files. Supported platforms: Windows, macOS, and Linux. Validation evidence: GitHub Actions CI directly validates Ubuntu. Windows and macOS are intended but not yet directly validated.

## Exit codes

| Code | Meaning                                   |
| ---- | ----------------------------------------- |
| `0`  | The command completed successfully.       |
| `1`  | YAML parsing or schema validation failed. |
| `2`  | The command or input path is invalid.     |

Validation diagnostics include each source file and YAML path. They include an object ID when one exists. They give a correction hint when one is clear. They do not include credentials. Supported platforms: Windows, macOS, and Linux. Validation evidence: GitHub Actions CI directly validates Ubuntu; other platform behavior is not yet directly validated.

## Support

For help or discussion, join the Eliware community:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## License

[license](LICENSE)

## Links

- [Home Page](https://github.com/eliware/netdoc#readme)
- [GitHub repository](https://github.com/eliware/netdoc.git)
- [Eliware](https://eliware.org)
- [GitHub organization](https://github.com/eliware)
- [Discord](https://discord.gg/M6aTR9eTwN)
- [specifications](specs/README.md)
- [docs](docs/README.md)
- [Release Notes](RELEASE_NOTES.md)
- [npm Package](https://www.npmjs.com/package/@eliware/netdoc)
