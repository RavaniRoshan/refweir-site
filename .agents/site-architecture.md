# Refweir Marketing Site Architecture & Information Architecture (IA) Plan

This document establishes the official site architecture, page hierarchy, navigation model, URL taxonomy, and internal linking strategy for **Refweir** (`https://refweir.dev`), integrating the Vite+React marketing landing surface, the Fumadocs technical documentation ecosystem (`/docs`), and the hosted interactive demo (`https://demo.refweir.dev`).

---

## 1. Executive Context & Strategic Foundation

### 1.1 What Refweir Does
Refweir is the self-hosted, vendor-neutral Git forge designed specifically for autonomous AI coding agents (Claude Code, Cursor, Codex, OpenCode, custom agents) and supervised by human maintainers. It solves the existential security, hygiene, and ergonomics friction of using human-centric Git platforms (GitHub/GitLab) with agents:
- **Capability Leases**: Ephemeral, cryptographic, scope-bound leases (e.g. 1-hour branch-only write access) instead of perpetual Personal Access Tokens (PATs) or service accounts.
- **Native MCP Interface**: Out-of-the-box Model Context Protocol tools (`refweir_branch`, `refweir_commit`, `refweir_pr`, `refweir_review`) removing the need for agents to wrestle with complex Git CLI invocations.
- **Zero-Dependency Single Binary**: Pure Go (`refweird`), embedded SQLite, embedded React 19 forge UI, no external database or container requirements.

### 1.2 Target Audiences & Visitor Intent
1. **AI Engineers & Agent Builders**: Want to point Claude Code, Cursor, or an internal agent swarm at a repository without risking main branch corruption or configuring GitHub App tokens.
   - *Primary Intent*: Fast integration, copy MCP config, inspect lease API, test agent flow in sandbox.
2. **Platform & SecOps Engineers**: Evaluating compliance, blast radius containment, audit logging, self-hosting privacy, and secret leakage prevention.
   - *Primary Intent*: Understand security model, review RBAC/grants hierarchy, evaluate SSO/SCIM and single-binary deployment footprint.
3. **Engineering Leads & Human Maintainers**: Managing team PR velocity, branch protections, human approval gates, and multi-agent coordination.
   - *Primary Intent*: Compare with GitHub/GitLab, assess pricing/open-source licensing, and view live forge ergonomics.

### 1.3 Core Site Goals
1. **Direct Conversion**: Drive rapid adoption via a 1-line installation bootstrap (`curl -fsSL https://refweir.dev/install.sh | bash`) and zero-auth interactive trial on the hosted demo (`demo.refweir.dev`).
2. **Positioning & Differentiation**: Establish the category of "Agent-Native Forge" vs legacy human-centric Git platforms with PAT sprawl.
3. **Frictionless Documentation On-Ramp**: Provide instant 1-click transit from high-level architectural benefits to technical docs (`/docs`), setup tutorials, and MCP schemas.

---

## 2. Page Hierarchy (ASCII Tree)

The architecture adopts a **hybrid SaaS model**: an ultra-high-converting, interactive single-page marketing landing experience at L0/L1, backed by structured, crawlable multi-page hubs for Docs, Comparisons, Agents, and Resources.

```text
Refweir Ecosystem (https://refweir.dev)
│
├── Homepage (/) [L0 - Marketing Core]
│   ├── #product (Interactive Terminal & Agent Split-Screen Demo)
│   ├── #why (Core Pillars: Leases, Native MCP, Pure Go Single Binary)
│   ├── #workflow (End-to-End Agent Lifecycle: Lease → Branch → PR → Merge)
│   ├── #policy (Granular Lease Scopes & Branch Guardrails)
│   ├── #compare (Feature Matrix: Refweir vs GitHub vs Gitea)
│   ├── #proof (Verbatim Terminal & JSON Capability Lease Session Logs)
│   ├── #pricing (Self-Hosted OSS vs Enterprise Cloud)
│   ├── #faq (Technical, Security, and Operational FAQ)
│   └── #start (1-Line Terminal Bootstrap & Seed Instructions)
│
├── Live Demo (https://demo.refweir.dev) [External Hosted Sandbox]
│   ├── / (Pre-seeded repository with synthetic agent PRs & active leases)
│   └── /api/v1/demo/* (Safe sandbox execution endpoints: agent-run, merge)
│
├── Documentation (/docs) [L1 - Technical Knowledge Base]
│   ├── Getting Started (/docs/getting-started) [L2]
│   │   ├── Quickstart (/docs/getting-started/quickstart) [L3]
│   │   ├── Installation (/docs/getting-started/installation) [L3]
│   │   └── First Agent Run (/docs/getting-started/first-agent) [L3]
│   │
│   ├── Agent Integrations (/docs/how-to/mcp-setup) [L2]
│   │   ├── Claude Code Guide (/docs/how-to/claude-code) [L3]
│   │   ├── Cursor Setup (/docs/how-to/cursor) [L3]
│   │   └── Custom MCP Agents (/docs/how-to/custom-mcp) [L3]
│   │
│   ├── Architecture & Security (/docs/architecture) [L2]
│   │   ├── Capability Leases (/docs/explanation/capability-leases) [L3]
│   │   ├── Grant Precedence & RBAC (/docs/explanation/grant-precedence) [L3]
│   │   └── Merge Engine & Guardrails (/docs/explanation/merge-engine) [L3]
│   │
│   ├── Guides & Operations (/docs/how-to) [L2]
│   │   ├── Terraform & Helm (/docs/how-to/terraform-helm) [L3]
│   │   ├── Enterprise SSO & SCIM (/docs/how-to/enterprise-sso-scim) [L3]
│   │   └── SSH & Git LFS Transport (/docs/how-to/ssh-git-lfs) [L3]
│   │
│   └── Reference (/docs/reference) [L2]
│       ├── MCP Tool Catalog (/docs/reference/mcp-tools) [L3]
│       ├── Daemon CLI (refweird) (/docs/reference/cli) [L3]
│       ├── Configuration Spec (/docs/reference/configuration) [L3]
│       └── REST API Reference (/docs/reference/api) [L3]
│
├── Comparison Landing Hub (/compare) [L1 - Organic Search & High-Intent Acquisition]
│   ├── Refweir vs GitHub Enterprise (/compare/github) [L2]
│   ├── Refweir vs GitLab Agent Workflows (/compare/gitlab) [L2]
│   └── Refweir vs Gitea / Forgejo (/compare/gitea) [L2]
│
├── Agent Compatibility Hub (/agents) [L1 - Ecosystem Directory]
│   ├── Claude Code Integration (/agents/claude-code) [L2]
│   ├── Cursor IDE Integration (/agents/cursor) [L2]
│   └── Windsurf & Custom Agent Stacks (/agents/windsurf) [L2]
│
└── Governance & Legal (/) [L1 - Trust Surfaces]
    ├── Changelog (/changelog) [L2]
    ├── Roadmap (/docs/roadmap) [L2]
    ├── Security Advisory & Reporting (/security) [L2]
    └── License (Apache-2.0) (https://github.com/RavaniRoshan/refweir/blob/main/LICENSE)
```

---

## 3. Visual Sitemap & Navigation Flow

```mermaid
graph TD
    subgraph Navigation Header
        HOME["Homepage (/)"]
        PROD["#product"]
        WHY["#why"]
        FLOW["#workflow"]
        COMP["#compare"]
        PRICE["#pricing"]
        DOCS["Docs (/docs)"]
        DEMO_CTA["CTA: Try Live Demo"]
        HOST_CTA["CTA: Self-Host"]
    end

    subgraph Landing Page Chapters
        HERO["Hero & Install Flow"]
        DEMO_BLOCK["Interactive Terminal Split"]
        BENEFITS["3 Pillars (Leases / MCP / Go)"]
        DIFF_TABLE["Vs Table: GitHub / Gitea"]
        WORKFLOW_DEMO["Interactive Lease Lifecycle"]
        POLICY_PANEL["Scope & Guardrail Spec"]
        SESSION_PROOF["Verbatim Terminal & JSON Logs"]
        PRICING_PLANS["Community OSS vs Enterprise"]
        FAQ_ACCORDION["Technical & Security FAQ"]
        FINAL_INSTALL["#start Bootstrap CTA"]
    end

    subgraph External Sandboxes & Repositories
        LIVE_DEMO["demo.refweir.dev (Hosted Sandbox)"]
        GH_REPO["GitHub: RavaniRoshan/refweir"]
    end

    subgraph Deep Documentation (/docs)
        DOCS_START["Getting Started"]
        DOCS_MCP["MCP Configuration"]
        DOCS_ARCH["Security & Architecture"]
        DOCS_CLI["refweird CLI & Config"]
    end

    %% Flow connections
    HOME --> HERO
    HERO --> DEMO_CTA --> LIVE_DEMO
    HERO --> HOST_CTA --> FINAL_INSTALL
    HERO --> DOCS --> DOCS_START

    HERO --> DEMO_BLOCK --> BENEFITS --> DIFF_TABLE --> WORKFLOW_DEMO --> POLICY_PANEL --> SESSION_PROOF --> PRICING_PLANS --> FAQ_ACCORDION --> FINAL_INSTALL

    BENEFITS --> DOCS_ARCH
    DIFF_TABLE --> COMP
    WORKFLOW_DEMO --> DOCS_MCP
    SESSION_PROOF --> GH_REPO
    FINAL_INSTALL --> LIVE_DEMO
```

---

## 4. URL Taxonomy & Master Page Map

| Page / Section | Canonical URL | Type / Parent | Primary Navigation Placement | Conversion & SEO Priority | Primary User Action |
|:---|:---|:---|:---|:---:|:---|
| **Marketing Homepage** | `https://refweir.dev/` | L0 Core | Logo / Header Root | Critical | Copy bootstrap command or launch demo |
| **Product Overview** | `https://refweir.dev/#product` | Anchor | Header Nav (1st) | High | Interact with split-screen terminal demo |
| **Why Refweir** | `https://refweir.dev/#why` | Anchor | Header Nav (2nd) | High | Inspect 3 architectural pillars |
| **Agent Workflow** | `https://refweir.dev/#workflow` | Anchor | Header Nav (3rd) | High | Understand agent branch & PR flow |
| **Security Policy** | `https://refweir.dev/#policy` | Anchor | Header Nav (4th) | Medium | Review capability lease scopes |
| **Vs GitHub / Gitea** | `https://refweir.dev/#compare` | Anchor | Header Nav (5th) | High (SEO/Intent) | Compare agent friction vs legacy PATs |
| **Pricing & Licenses** | `https://refweir.dev/#pricing` | Anchor | Header Nav (6th) | High | Choose between Community & Enterprise |
| **Technical FAQ** | `https://refweir.dev/#faq` | Anchor | Header Nav (7th) | Medium | Resolve deployment & security questions |
| **Install & Bootstrap** | `https://refweir.dev/#start` | Anchor | Header Secondary CTA | Critical | Copy `curl ... \| bash` bootstrap script |
| **Hosted Live Demo** | `https://demo.refweir.dev/` | External | Header Primary CTA & Hero | Critical | Instant 1-click test of live forge & agent PRs |
| **Documentation Root** | `https://refweir.dev/docs` | L1 Hub | Header Nav & Footer | Critical | Access guides, tutorials, and references |
| **Quickstart Guide** | `https://refweir.dev/docs/getting-started` | L2 Doc | Docs Sidebar & Hero | High | Complete 5-minute setup |
| **MCP Setup & Tools** | `https://refweir.dev/docs/how-to/mcp-setup` | L2 Doc | Docs Sidebar & Workflow | High | Configure Claude Code / Cursor MCP servers |
| **Security & Leases** | `https://refweir.dev/docs/explanation/capability-leases` | L2 Doc | Docs Sidebar & Policy | High | Deep-dive cryptographic lease mechanics |
| **CLI Reference** | `https://refweir.dev/docs/reference/cli` | L2 Doc | Docs Sidebar & Footer | Medium | Inspect `refweird` flags and config keys |
| **GitHub Repository** | `https://github.com/RavaniRoshan/refweir` | External | Header Nav Right & Footer | High | Star repo, view issues, inspect Go source |
| **Open Source License** | `https://github.com/.../LICENSE` | External | Footer Legal | Medium | Verify Apache-2.0 compliance |

---

## 5. Navigation Specification

### 5.1 Header Navigation
- **Structure**: Floating rounded glass pill (`bg-ink/85 backdrop-blur-xl border border-white/10`) pinned to top with safe-area insets.
- **Left**: Refweir mark + brand logo linking to `#top` (homepage root).
- **Center Menu (Desktop, ordered by evaluation sequence)**:
  1. `Product` (`#product`)
  2. `Why` (`#why`)
  3. `Workflow` (`#workflow`)
  4. `Policy` (`#policy`)
  5. `Compare` (`#compare`)
  6. `Pricing` (`#pricing`)
  7. `FAQ` (`#faq`)
- **Right Utilities & CTAs**:
  - `GitHub` (External link to repository with star awareness)
  - `Theme Toggle` (Instant dark/light toggle with zero flash)
  - `Read Docs` (`/docs` - secondary navigation bridge)
  - **Primary Action**: `Try Live Demo` (`https://demo.refweir.dev` - contrasting signal patina button)
  - **Secondary Action**: `Self-Host` (`#start` - anchor scroll to quickstart)
- **Mobile Menu**: Fullscreen / sheet overlay rendering oversized touch targets with numerical chapter badges (`01` through `08`), leading directly to anchors or docs.

### 5.2 Footer Navigation Matrix
Organized into 4 distinct semantic columns to adhere to enterprise IA standards:

| Column 1: Product | Column 2: Documentation | Column 3: Agents & Integrations | Column 4: Governance & Legal |
|:---|:---|:---|:---|
| • [Interactive Demo](https://demo.refweir.dev)<br>• [Workflow Engine](#workflow)<br>• [Capability Leases](#policy)<br>• [Compare with GitHub](#compare)<br>• [Pricing & Support](#pricing) | • [5-Minute Quickstart](/docs/getting-started)<br>• [Architecture Overview](/docs/architecture)<br>• [Daemon CLI (`refweird`)](/docs/reference/cli)<br>• [REST API Spec](/docs/reference/api)<br>• [Configuration Reference](/docs/reference/configuration) | • [Model Context Protocol](/docs/how-to/mcp-setup)<br>• [Claude Code Integration](/docs/how-to/claude-code)<br>• [Cursor IDE Setup](/docs/how-to/cursor)<br>• [MCP Tools Schema](/docs/reference/mcp-tools)<br>• [Custom Agent Leases](/docs/explanation/capability-leases) | • [GitHub Source (Apache-2.0)](https://github.com/RavaniRoshan/refweir)<br>• [Public Roadmap](/docs/roadmap)<br>• [Security Disclosures](/security)<br>• [Licence Details](https://github.com/RavaniRoshan/refweir/blob/main/LICENSE)<br>• `Pure Go · CGO_ENABLED=0` |

### 5.3 Breadcrumb Protocol
For multi-depth pages (such as `/docs` and comparison landing pages):
```text
Home (/) > Docs (/docs) > Guides (/docs/how-to) > MCP Setup (/docs/how-to/mcp-setup)
Home (/) > Compare (/compare) > Refweir vs GitHub Enterprise (/compare/github)
```
- Every ancestor node is a crawlable, clickable link.
- Current node is plain text with `aria-current="page"`.
- Mirrors the exact URL slug structure for optimal search engine snippet indexing.

---

## 6. Internal Linking & Content Hub Strategy

### 6.1 Hub-and-Spoke Content Clusters

#### Cluster A: The Capability Lease Security Model
- **Central Pillar Hub**: `/docs/explanation/capability-leases`
- **Inbound Spokes**:
  - Landing `#policy` section links to hub for cryptographic lease signing specs.
  - Landing `#proof` section links JSON lease snippet to the lease lifecycle explanation.
  - Comparison page (`/compare/github`) links to hub contrasting 1-hour leases against perpetual PATs.
- **Outbound Spokes**:
  - Hub links to `/docs/reference/mcp-tools` for tool invocation schema.
  - Hub links to `/docs/how-to/mcp-setup` for client agent setup.

#### Cluster B: Native Model Context Protocol (MCP) Integration
- **Central Pillar Hub**: `/docs/how-to/mcp-setup`
- **Inbound Spokes**:
  - Landing `#product` and `#workflow` sections link directly to MCP quickstart.
  - Hero secondary button links to MCP docs.
- **Outbound Spokes**:
  - Step-by-step guides for Claude Code, Cursor, and Windsurf.
  - Complete JSON schema definitions in `/docs/reference/mcp-tools`.

### 6.2 3-Click Navigation Compliance
- **Homepage to Live Demo**: **1 Click** (Header CTA / Hero primary button).
- **Homepage to Working CLI Install**: **0 Clicks** (Verbatim command displayed in Hero and `#start`).
- **Homepage to MCP Configuration**: **2 Clicks** (Header Docs → MCP Setup).
- **Any Documentation Page to GitHub Source**: **1 Click** (Header nav or footer link).

### 6.3 Link Hygiene & Audit Rules
1. **Zero Dead Anchors**: All in-page navigation anchors (`#product`, `#why`, `#workflow`, `#policy`, `#compare`, `#pricing`, `#faq`, `#start`) must have exact matching `id` targets in the DOM.
2. **Standardized External Link Decorators**: All links leaving `refweir.dev` (such as GitHub or demo subdomain) must include `target="_blank" rel="noopener noreferrer"`.
3. **No Indexation Leaks**: Subdomains and docs directories must maintain consistent robots and canonical tags pointing to `https://refweir.dev/`.
