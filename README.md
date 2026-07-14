# PathMX Learning Starter

A small starter workspace for building durable, interactive learning paths
with PathMX and AI agents.

This repository is intentionally light. It provides a learner profile, a first
topic path, an experiment lab, repository instructions, and a focused PathMX
authoring skill. Add structure only when the learning journey needs it.

## Current contributor setup

The eventual product should install through the PathMX Learning Codex plugin.
Until that is ready, contributors use the scoped PathMX package through Bun:

```sh
bun add -g @fellowhumans/pathmx@latest
pathmx --version
pathmx play
```

For a one-off run without a global PathMX install:

```sh
bunx @fellowhumans/pathmx@latest play
```

Open the Player URL printed by the command.

## Repository shape

```text
AGENTS.md
.agents/skills/pathmx-authoring/SKILL.md
paths/
├── index.path.md
├── profile/index.persona.md
├── topics/getting-started.path.md
└── labs/sandbox.lab.md
```

- `paths/index.path.md` is the learner's home.
- `paths/profile/` holds confirmed learner goals and preferences.
- `paths/topics/` holds maintained learning paths.
- `paths/labs/` is a safe place for experiments before promotion.

## Privacy

Do not commit credentials, private links, institutional records, or sensitive
learner information. Keep the checked-in profile generic unless the learner
explicitly chooses to share it.

## Status

Early Build Week scaffold. The teaching workflow, plugin, and richer learning
components will evolve through real learner testing.
