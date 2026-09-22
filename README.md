# NetDoc

NetDoc is a Git-versioned, human- and AI-readable model for documenting network infrastructure, systems, services, and their relationships.

It is intended to capture the complete operational picture of an environment without requiring automatic discovery, a database, a CRUD web interface, or a management server. The initial tool should be a small validator that checks the configuration for consistency and gives useful guidance when something is wrong.

## Goals

- Document physical infrastructure, virtual infrastructure, networks, systems, and services in one coherent model.
- Represent physical media accurately, including Ethernet, fiber, and wireless links.
- Represent named physical and virtual interfaces without pretending everything is a numbered RJ45/SFP port.
- Represent logical networks such as subnets, VLANs, SSIDs, VPNs, overlays, and virtual networks.
- Describe attachments and relationships between devices, interfaces, networks, bridges, switches, tunnels, systems, and services.
- Preserve operational context such as routing, BGP, firewall policy, NAT, VRRP, load balancing, storage, backups, failover, and configuration sources of truth.
- Keep the result easy for humans and AI agents to read, edit, review, and version in Git.

## Modeling principles

### Asset-centric documentation

Each physical or virtual asset should be understandable on its own. Interfaces, operating system details, storage, workloads, and services belong with the asset that owns them.

Assets may be physical or hosted by another asset:

```yaml
id: core1
kind: virtual-machine
host: xcp1

operatingSystem:
  name: VyOS

interfaces:
  - id: core1-lan
    name: eth0
    kind: virtual-ethernet
    addresses: [core1-lan-address]

routing:
  bgp:
    localAs: 65101
```

There is no unnecessary distinction between “devices” and “systems.” An asset has a kind and may host or run on another asset.

### Physical versus logical networking

NetDoc should distinguish:

- Physical links: Ethernet, fiber, wireless links, and other media
- Interfaces: Ethernet NICs, Wi-Fi radios, VLAN interfaces, WireGuard interfaces, VM NICs, bridges, and virtual switch ports
- Logical networks: subnets, VLANs, SSIDs, VPNs, overlays, and virtual networks
- Attachments: how an interface participates in or connects to a network
- Relationships: routing peers, tunnel peers, service dependencies, storage consumers, and failover pairs

Wi-Fi is a physical network medium, while an SSID is a logical network carried over that medium. VLANs and VPNs are logical networking constructs, even when they use physical interfaces underneath.

## Configuration organization

The configuration should support both a single merged document and modular files:

```text
netdoc-config/
  netdoc.yaml
  sites.yaml
  networks.yaml
  links.yaml
  assets/
    home-router.yaml
    xcp1.yaml
    core1.yaml
    cp1.yaml
  services/
    kubernetes.yaml
    storage.yaml
  policies/
    routing.yaml
    firewall.yaml
```

The files should be easy to split or combine without changing their meaning. References use stable IDs, not display names, so files can be reorganized safely.

## Intended coverage

The schema should eventually cover:

- Sites, rooms, racks, locations, providers, and failure domains
- Hardware, CPU, memory, drives, RAID, GPUs, power, and lifecycle data
- Physical hosts, hypervisors, VMs, containers, and nested workloads
- Interfaces, addresses, MACs, speeds, media, bridges, and virtual switches
- Ethernet, fiber, Wi-Fi, SSIDs, VLANs, VPNs, tunnels, and overlays
- Subnets, DHCP, DNS, gateways, public address blocks, and IP assignments
- Routing, BGP, OSPF, static routes, VRRP, firewall rules, NAT, and HAProxy
- Services, listeners, protocols, URLs, dependencies, and domain routing
- Kubernetes clusters, nodes, CNI, workloads, storage, and exposed services
- Storage clusters, volumes, replicas, mounts, consumers, and recovery details
- Backups, monitoring, certificates, operational notes, and source repositories

Secrets, private keys, passwords, preshared keys, and other credentials should never be stored directly in the configuration. The schema may contain safe references to external secret stores.

## Validator-first MVP

The first implementation should provide a simple read-only validator rather than CRUD commands or a web application.

The validator should detect:

- Duplicate or missing IDs
- Broken references between files
- Invalid IP addresses, CIDRs, VLAN IDs, MAC addresses, ports, and ASNs
- Duplicate address assignments
- Interfaces attached to undefined networks
- Invalid tagged, untagged, trunk, and native VLAN relationships
- Missing VPN or routing peers
- Services pointing to nonexistent assets or interfaces
- VMs hosted on nonexistent hypervisors
- Physical links referencing nonexistent interfaces
- Contradictory or incomplete failover relationships
- Secret-like values embedded in YAML

Errors should identify the file, path, and related object, then explain the problem and suggest a correction where possible.

Future capabilities may include generated reports, topology diagrams, a CLI, API, GUI, or MCP service, but none are required for the initial version.

