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

NetDoc checks YAML inventory against schemas and cross-record rules. It reports recorded dates, prints Mermaid topology, generates Snowflake IDs, and exports machine inventory for Ansible.

## Requirements

- Node.js 26 or later.
- npm for package installation and repository checks.
- Ansible for playbook use of exported inventory.

## Setup

Install the public package with npm:

```sh
npm install --global @eliware/netdoc
```

The package provides the `netdoc` command and includes its source, schemas, and user documentation. Approved releases publish package versions to npm.

## Usage

Run `netdoc --help` to view command syntax. Read the [CLI guide](docs/cli-guide.md) for installation, inventory format, command options, examples, validation results, and troubleshooting. See [release notes](RELEASE_NOTES.md) for version changes.

## Development

Read [AGENTS.md](AGENTS.md), the [documentation index](docs/README.md), and the [specification index](specs/README.md) before making changes.

## Testing

Run `npm ci` to install the locked dependencies. Run `npm test` for repository validation.

## Troubleshooting

Read the command error and correct the named path, option, or YAML value. See the [CLI guide](docs/cli-guide.md#troubleshooting) for common problems.

## Security

Keep credentials, keys, secrets, and private data out of inventory files and Git.

## Configuration

NetDoc has no environment configuration. Pass an inventory file or directory path to commands that read inventory.

## Operations

NetDoc reads inventory and prints results. It does not change inventory files, connect to devices, or test live network state.

## Commands

NetDoc provides validation, freshness reports, topology graphs, ID generation, and Ansible inventory commands. Read the [CLI guide](docs/cli-guide.md#commands) for exact syntax and examples.

## Exit codes

| Code | Meaning                                                                     |
| ---- | --------------------------------------------------------------------------- |
| `0`  | The command completed successfully.                                         |
| `1`  | Inventory data failed a check.                                              |
| `2`  | The command, option, or path is invalid, or NetDoc cannot load its schemas. |

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
