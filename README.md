# PathMX Learning Starter

A starter workspace for building durable, interactive learning paths with
PathMX and AI agents.

The workspace is intentionally light: a learner home, a profile, an activity
log, one worked-example path (`welcome/`), a small component family, and the
`path` + `pathmx` agent skills. Structure grows only when the learning
journey needs it.

## Setup

Install PathMX (requires [Bun](https://bun.sh)) and open the player:

```sh
bun add -g @fellowhumans/pathmx@latest
pathmx play paths/index.path.md --open
```

For a one-off run without a global install:

```sh
bunx @fellowhumans/pathmx@latest play paths/index.path.md --open
```

Then start a session by asking your agent to `/path`.

## Repository shape

```text
AGENTS.md                       # workspace contract for agents
.agents/skills/                 # path + pathmx skills
paths/
├── index.path.md               # the learner's home (root source)
├── learner.profile.md          # learner profile
├── learning.activity.md        # syntheses and evidence across all paths
├── theme.css                   # shared styling
├── assets/learning.components.md
└── welcome/                    # worked-example path: outcome, index, lesson, assessment
```

The skills are synced from [pathmx-skills](https://github.com/pathmx/pathmx-skills).
Everything under `paths/` belongs to the learner. The `welcome/` path is the
example for new paths.

## Privacy

Do not commit credentials, private links, institutional records, or sensitive
learner information. Keep the checked-in profile limited to what the learner
explicitly chooses to share.
