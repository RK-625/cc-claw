# Taste
- Requires explicit permission before making code edits or implementation changes; reading, exploring, and verifying the codebase is fine without approval. Confidence: 0.9
- Requires a "grounding pass" before writing or modifying any code: read AGENTS.md first, then every dependency manifest and lockfile, recording the EXACT installed versions of frameworks/libraries and the runtime version. Confidence: 0.9
- Treats trained/memorized knowledge about library APIs as hypotheses, not facts — verify the API against the installed version's actual source (node_modules) or version-specific docs/changelogs before using it. Confidence: 0.9
- Wants a grounding summary acknowledged before acting: stack + exact versions, module/directory map, key local conventions, and a list of places where trained knowledge would mislead in this specific codebase. Confidence: 0.9
- Treats repo-local configuration as binding: lint/format/type-check config is the style for the repo (not general best practice), and project rule files (AGENTS.md) take precedence. Confidence: 0.9
- Wants local conventions learned by sampling representative files per module (naming, error handling, state management, import patterns, internal wrapper abstractions) rather than assuming a generic architecture. Confidence: 0.9
