# PathMX Learning Starter

A Player-native learning loop where learner Responses, coach receipts, and
generated learning Blocks remain durable, readable PathMX Sources.

## Run the starter

Install the exact PathMX release and start the Player (requires
[Bun](https://bun.sh)):

> Release preparation: `package.json` targets the pending 0.1.19 release. The
> package must be published and `bun.lock` generated before clean-clone setup.

```sh
bun install
bun run dev
```

To try the complete journey without changing the checked-in learner Sources,
run the disposable demo instead:

```sh
bun run demo
```

Open the printed `/new.path` route, submit a goal, confirm the proposed Path,
and answer the first Question in the created Lesson. The proposal confirmation
creates the Path, first Lesson, and updated onboarding Source atomically. Stop
the demo with Ctrl-C to remove its temporary Sources.

The deterministic fake coach is the default so a fresh setup works without an
agent sign-in. To use the installed, authenticated Codex CLI instead:

```sh
PATHMX_AGENT_DRIVER=codex bun run dev
```

The Codex adapter receives only explicitly selected Source context, runs in an
ephemeral read-only directory with tools disabled, and returns schema-validated
proposal data. It never receives a writable learning repository.

## Verify

```sh
bun run check
bun run smoke:fake
bun run smoke:codex
```

The live Codex smoke uses a disposable copy of `paths/` and proves two real
agent turns: onboarding, atomic Path + Lesson creation, then a learner Response
and coach turn inside the new Lesson. It does not write prepared model output
into this repository.

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
├── library/                    # maintained pattern registry and scaffolds
├── new.path.md                 # goal, proposal, and confirmation surface
├── coach.persona.md            # trusted coach context
└── welcome/                    # worked-example path: outcome, index, lesson, assessment
```

The Starter pins `@fellowhumans/pathmx` to one exact npm version. Learning-
specific Actions, the coordinator, context projection, agent drivers, Source
formatting, Personas, templates, and the component catalog all live here.
Everything under `paths/` belongs to the learner.

## Privacy

Do not commit credentials, private links, institutional records, or sensitive
learner information. Keep the checked-in profile limited to what the learner
explicitly chooses to share.
