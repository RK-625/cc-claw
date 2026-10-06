# ccclaw

**CCC-law CLI Agent** — An AI-powered code agent for terminal-based development workflows.

Built with **Bun**, **TypeScript**, and the **Vercel AI SDK**.

---

## 🏗️ Architecture Overview

```
ccclaw/
├── index.ts                 # CLI entry point (commander-based)
├── ai/                      # AI model configuration
│   ├── index.ts             # Exports getModel()
│   └── ai.config.ts         # OpenRouter model provider setup
├── modes/                   # Operational modes
│   ├── cli.ts               # Interactive mode selector (Agent/Plan/Ask)
│   └── agent/               # Agent mode implementation
│       ├── orchestrator.ts  # Main agent loop (ToolLoopAgent)
│       ├── action-tracker.ts# Tracks file/shell operations
│       ├── tool-executor.ts # Stages & applies mutations
│       ├── agent-tools.ts   # Tool definitions for the agent
│       ├── approval.ts      # Interactive diff review & approval
│       ├── diff-view.ts     # Unified diff formatting
│       └── types.ts         # Shared type definitions
├── tui/                     # Terminal UI components
│   ├── start.ts             # Banner + top-level menu (figlet)
│   └── terminal-md.ts       # Markdown rendering for terminal
├── .agents/                 # Agent rule configurations
├── .cursor/                 # Cursor IDE rules
└── package.json
```

---

## 🚀 Quick Start

### Install Dependencies
```bash
bun install
```

### Run the CLI
```bash
bun run index.ts
# or after installing globally: ccclaw
```

### Configure AI
Set your OpenRouter credentials:
```bash
export OPENROUTER_API_KEY="your-api-key"
export OPENROUTER_DEFAULT_MODEL="anthropic/claude-3.5-sonnet"
```

---

## 🎯 Core Features

| Feature | Description |
|---------|-------------|
| **Agent Mode** | Autonomous task execution with tool use |
| **Staged Mutations** | All file/shell changes staged until user approval |
| **Interactive Diff Review** | Per-file unified diffs with approve/skip |
| **Plan / Ask Modes** | Planned: read-only analysis & Q&A workflows |
| **Terminal Markdown** | Rich output rendering in-terminal |
| **Skill System** | Load `.claude/skills` & `.cursor/skills-cursor` |

---

## 🔧 Agent Tools (Available to the LLM)

| Tool | Purpose |
|------|---------|
| `read_file` | Read workspace files |
| `create_file` | Stage new file creation |
| `modify_file` | Stage full-file replacement |
| `delete_file` | Stage file deletion |
| `create_folder` | Stage directory creation |
| `list_files` | Tree listing with exclusions |
| `search_files` | Glob + optional content search |
| `analyze_codebase` | File/directory counts summary |
| `execute_shell` | Queue shell commands (pending approval) |
| `list_skills` | Discover SKILL.md files |
| `read_skill` | Read a specific skill definition |

---

## ⚙️ Configuration

**AgentConfig** (in `modes/agent/types.ts`):
```typescript
{
  codebasePath: process.cwd(),
  maxFileSizeToRead: 1MB,
  excludePatterns: ['node_modules', '.git', 'dist', 'build', '.next', '*.log', '.env*'],
  tools: {
    allowShellExecution: true,
    allowFileModification: true,
    allowFileCreation: true,
    allowFolderCreation: true,
  }
}
```

---

## 📦 Key Dependencies

- **Runtime**: Bun v1.x
- **CLI Framework**: `commander` + `@clack/prompts`
- **AI**: `ai` (Vercel AI SDK) + `@openrouter/ai-sdk-provider`
- **Terminal**: `chalk`, `figlet`, `marked` + `marked-terminal`
- **Diff**: `diff` (unified patches)

---

## 🛠️ Development

### Type Check
```bash
bunx tsc --noEmit
```

### Project Structure Notes
- **ES Modules only** (`"type": "module"` in package.json)
- **Path aliases**: None (uses relative imports)
- **Staging model**: Mutations go to an in-memory overlay → user approval → atomic apply

---

## 📄 License

MIT