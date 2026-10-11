# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/netdoc [![npm](https://img.shields.io/npm/v/@eliware/netdoc)](https://www.npmjs.com/package/@eliware/netdoc) [![License](https://img.shields.io/github/license/eliware/netdoc)](https://github.com/eliware/netdoc/blob/main/LICENSE) [![CI](https://github.com/eliware/netdoc/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/netdoc/actions/workflows/ci.yaml)

Git-versioned model for documenting network infrastructure, systems, services, and their relationships.

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
- [Links](#links)
- [License](#license)

## Features

NetDoc provides read-only validation for infrastructure YAML. It also generates unique Snowflake IDs. It owns the schemas and CLI. Inventory records belong in the separate `netdoc-config` repository.

The CLI checks YAML syntax, object schemas, BIGINT IDs, object references, reciprocal links, IP assignments, segment networks, and IP values. It does not edit records or connect to a network.

## Requirements

- Node.js 26 or later.
- npm 12 or later for repository validation.

## Setup

Install the public package:

```sh
npm install --global @eliware/netdoc
```

The `netdoc` command runs `bin/netdoc.mjs`. The package version comes from `package.json`. The npm badge shows the published version. An unreleased package version is not available from npm.

## Usage

Run `netdoc --help` to show available commands. Run `netdoc validate <path>` to check a YAML file or directory. Run `netdoc --generate-id` to print one ID.

Run `netdoc --generate-id -n 3` to print three Snowflake IDs. Validation does not edit input files. ID generation prints IDs to standard output. See [Release Notes](RELEASE_NOTES.md) for version changes.

## Development

Use Node.js 26 or later and npm 12 or later. Install locked dependencies and run shared validation:

```sh
npm ci
npm test
```

Run `npm run lint`, `npm run format:check`, `npm run audit`, or `npm run pack` for one validation stage. Run `npm run format` to change supported files.

Read [AGENTS.md](AGENTS.md), the [documentation index](docs/README.md), and the [specification index](specs/README.md) before you change the project.

Ubuntu CI validates Node.js 26. Windows and macOS are supported but are not directly validated by CI.

## Testing

`npm test` runs Eliware validation, Jest tests, and coverage. Tests use local fixtures and mocked command calls. Tests do not connect to a network.

## Troubleshooting

If `netdoc` is not found, confirm Node.js 26 or later is installed and the global npm path is available. Run `npm test` to validate a checkout. Use the file or directory path required by `validate`.

## Security

The validator reads YAML and reports errors. ID generation prints to standard output. Do not store credentials in inventory or expose secrets in diagnostics.

## Configuration

NetDoc has no runtime settings or environment variables. Package metadata and workflow files are not runtime configuration.

## Operations

Startup occurs when a user runs a command. The command exits after it completes. Workflows include local validation and ID output. NetDoc does not write files, connect to a network, or change external systems.

## Commands

| Command                     | Behavior                                        |
| --------------------------- | ----------------------------------------------- |
| `netdoc --help`             | Print help and exit with code 0.                |
| `netdoc --version`          | Print the package version and exit with code 0. |
| `netdoc validate <path>`    | Validate YAML files in a file or directory.     |
| `netdoc --generate-id`      | Print one Snowflake ID.                         |
| `netdoc --generate-id -n 3` | Print three Snowflake IDs.                      |

## Exit codes

| Code | Meaning                                   |
| ---- | ----------------------------------------- |
| `0`  | The command completed successfully.       |
| `1`  | YAML parsing or schema validation failed. |
| `2`  | The command or input path is invalid.     |

Validation diagnostics include each source file and YAML path. They include an object ID when one exists. They give a correction hint when one is clear. They do not include credentials.

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## Links

- [Home Page](https://eliware.org)
- [GitHub Org](https://github.com/eliware)
- [GitHub Repo](https://github.com/eliware/netdoc)
- [Bug Reports](https://github.com/eliware/netdoc/issues)
- [npm](https://www.npmjs.com/package/@eliware/netdoc)
- [Discord](https://discord.gg/M6aTR9eTwN)

## License

[MIT © Eliware](LICENSE)
