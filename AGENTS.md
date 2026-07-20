# PathMX Learning Starter

This repository is a small Player-native learning application. The maintained
slice is intentionally limited to onboarding: a learner submits one durable
goal Response and Coach adds a durable proposal through PathMX Actions.

## Workflow

- Use `/pathmx` when authoring or verifying PathMX Sources.
- Start at `paths/index.path.md` and follow `paths/new.path.md` for the current
  onboarding flow.
- Keep durable learner and coach state in Sources, not only in process memory or
  an agent transcript.
- Add product surface incrementally only after the onboarding flow works through
  the real Server, Actor, Action, Build, Runtime, and Player path.

## Guardrails

- Do not edit synced files under `.agents/skills/pathmx/`.
- Do not commit credentials, private links, or sensitive learner data.
- Use the normal PathMX plugin and trusted Actor interfaces from the pinned npm
  package. Do not write Source files directly from the coordinator or driver.
- Keep Action code on parsed PathMX Sources and `context.plan`; do not re-parse
  Markdown or frontmatter inside Actions.
- Give the agent only explicit bounded read-only Source context.
- Build into a disposable output directory when testing. Never treat `.pathmx`
  as Source.
- Treat live Action submissions as real Source writes; use `bun run demo` for
  disposable visual testing.
