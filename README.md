# My PathMX learning space

This repository is a personal learning space: it holds learning paths, lesson
material, progress, work, and feedback in files that both you and an agent can
read.

The project dependency follows the latest PathMX Labs release. `bun.lock` and
the exact `pathmxCompatibility` baseline record the version most recently
verified for this space; your agent refreshes them only through the
build-and-Player verification loop.

## Begin

Open this folder in Codex, Claude Code, or another coding agent and say what you
want to learn. The repository instructions will guide the agent through a short
onboarding conversation and the first learning module.

To open the Player yourself:

```sh
bun install --frozen-lockfile
bun run play:open
```

The first ready lesson is [Using the PathMX Player](./paths/getting-started/player.lesson.md).

## What lives here

- `paths/index.path.md` is the home page and path map.
- `paths/learner.profile.md` holds only preferences and goals you confirm.
- `paths/learning.activity.md` is the durable progress log.
- `paths/getting-started/` contains the optional Player orientation.
- `.agents/skills/` tells agents how to design learning and author PathMX.
- `.agents/skills/` also defines the bounded worker pattern agents may use for
  independent later-module files without moving learner state out of the
  parent conversation.

Keep this repository private unless you deliberately choose to share it.
