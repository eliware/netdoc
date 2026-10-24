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

NetDoc validates YAML, reports date freshness, and prints topology graphs and Snowflake IDs.

## Requirements

- Node.js 26 or later.
- npm to install the package and run repository checks.

## Setup

Install the public package:

```sh
npm install --global @eliware/netdoc
```

The package includes the `netdoc` command, source, schemas, and user guide. Only approved releases publish versions to npm.

## Usage

Run `netdoc --help` to list commands. Read the [CLI guide](docs/cli-guide.md) for command details and the [release notes](RELEASE_NOTES.md) for version history.

## Development

Read [AGENTS.md](AGENTS.md), the [documentation index](docs/README.md), and the [specification index](specs/README.md) before you change files.

## Testing

Run `npm ci` to install locked dependencies. Run `npm test` for repository checks and test coverage.

## Troubleshooting

If a command fails, read its error and correct the named path, option, or YAML value.

## Security

Do not add credentials, keys, secrets, or private data to inventory files.

## Configuration

NetDoc has no runtime settings or environment variables.

## Operations

NetDoc reads inventory and prints results. It does not change files or connect to devices.

## Commands

| Command                                                | Result                                    |
| ------------------------------------------------------ | ----------------------------------------- |
| `netdoc --help`                                        | List commands.                            |
| `netdoc --version`                                     | Print the package version.                |
| `netdoc validate <path>`                               | Check YAML files and print text results.  |
| `netdoc validate <path> --format json`                 | Check YAML files and print JSON results.  |
| `netdoc report <path> --freshness --max-age-days DAYS` | Report object dates and age.              |
| `netdoc graph <path> --format mermaid`                 | Print inventory topology as Mermaid text. |
| `netdoc --generate-id [-n COUNT]`                      | Print one or more Snowflake IDs.          |

## Exit codes

| Code | Meaning                                                     |
| ---- | ----------------------------------------------------------- |
| `0`  | The command completed.                                      |
| `1`  | YAML data failed a check.                                   |
| `2`  | Invalid command or path, or NetDoc cannot load its schemas. |

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
