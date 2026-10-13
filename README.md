# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/netdoc [![npm](https://img.shields.io/npm/v/@eliware/netdoc)](https://www.npmjs.com/package/@eliware/netdoc) [![License](https://img.shields.io/github/license/eliware/netdoc)](https://github.com/eliware/netdoc/blob/main/LICENSE) [![CI](https://github.com/eliware/netdoc/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/netdoc/actions/workflows/ci.yaml)

Git-versioned inventory for network infrastructure and systems, with YAML schemas, validation, and Snowflake ID generation.

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

NetDoc checks infrastructure YAML and prints Snowflake IDs. Read the [user guide](docs/cli-guide.md) for command details.

## Requirements

- Node.js 26 or later.
- npm 12 or later to check this repository.

## Setup

Install the public package:

```sh
npm install --global @eliware/netdoc
```

The package installs the `netdoc` command. It includes the CLI, schemas, and user guide. An approved release publishes the package to npm.

## Usage

Run `netdoc --help` to list commands. Use `netdoc validate <path>` to check YAML. Use `netdoc --generate-id` to print an ID. Read the [user guide](docs/cli-guide.md) for details and [release notes](RELEASE_NOTES.md) for changes.

## Development

Read [AGENTS.md](AGENTS.md), the [documentation index](docs/README.md), and the [specification index](specs/README.md) before you change the project.

## Testing

Run `npm ci` to install locked dependencies. Run `npm test` to check code, format, dependencies, package contents, and test coverage.

## Troubleshooting

If `netdoc` is not found, install the package again. If validation fails, read each error and correct the named YAML value.

## Security

Do not store credentials in inventory files. NetDoc does not print secret values.

## Configuration

NetDoc has no runtime settings or environment variables.

## Operations

Run a command to start NetDoc. It exits when the command ends. NetDoc reads input files and writes results to the terminal. It does not change files or connect to a network.

## Commands

| Command                  | Result                     |
| ------------------------ | -------------------------- |
| `netdoc --help`          | List commands.             |
| `netdoc --version`       | Print the package version. |
| `netdoc validate <path>` | Check YAML files.          |
| `netdoc --generate-id`   | Print one Snowflake ID.    |

See the [user guide](docs/cli-guide.md) for command options and examples.

## Exit codes

| Code | Meaning                         |
| ---- | ------------------------------- |
| `0`  | The command completed.          |
| `1`  | YAML data failed a check.       |
| `2`  | The command or path is invalid. |

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
