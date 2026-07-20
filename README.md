# PathMX Learning Starter

A small Player-native onboarding loop built on the normal PathMX Server,
Actor, Action, Build, Runtime, and Player architecture.

The maintained slice does one thing: a learner submits a multi-field learning
goal, Coach records a pending turn, and a validated proposal becomes ordinary
readable Blocks in the same Source. Source remains truth across reloads.

## Run

Install the exact PathMX package and start the Player:

> `package.json` currently targets the pending `0.1.19` release. Publish that
> package and generate `bun.lock` before treating clean-clone installation as
> complete.

```sh
bun install
bun run dev
```

The default deterministic Coach requires no agent sign-in. To use an installed,
authenticated Codex CLI:

```sh
PATHMX_AGENT_DRIVER=codex bun run dev
```

For visual testing without changing checked-in Sources:

```sh
bun run demo
```

Open the printed `/new.path` route and submit a goal. Stop the demo with Ctrl-C
to remove its temporary Sources.

## Verify

```sh
bun run check
bun run smoke:fake
bun run smoke:codex
```

The fake integration test and live Codex smoke use disposable copies of
`paths/`. Both cross the same HTTP, Actor, Action, Source mutation, incremental
Build, and reload path used by the Player.

## Shape

```text
.agents/skills/pathmx/       # PathMX authoring help
paths/
├── index.path.md            # learner entry
├── new.path.md              # onboarding Question and resulting proposal
└── coach.persona.md         # explicit Coach context
src/
├── server.ts                # normal PathMX server composition
└── learning/                # Starter-owned Actions, coordinator, and drivers
```

The coordinator and drivers never write Source files. Every durable mutation is
a PathMX Action planned from parsed Source state and applied through the shared
incremental Build pipeline.

Do not commit credentials, private links, or sensitive learner information.
