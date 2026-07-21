# Learning Space Instructions

This is one learner's personal PathMX learning space. Keep it understandable to
the learner and to the next agent by writing durable state into the repository.

## Start here

1. Read `paths/index.path.md`, `paths/learner.profile.md`, and
   `paths/learning.activity.md`.
2. Read `.agents/skills/learn/SKILL.md` for learning design and use it
   automatically for learning-path work.
3. Read `.agents/skills/pathmx/SKILL.md` before writing or changing PathMX.
4. Run `bun install --frozen-lockfile` when dependencies are missing.
5. Keep the native command current with `pathmx self-update`, or install it
   with `bunx @fellowhumans/pathmx@latest self-update` when missing.

## Version safety

- The installed dependency resolved by `bun.lock` governs which syntax is
  valid here. The `package.json` dependency follows `latest`, but a newer
  native command or registry release does not change an existing lockfile.
- When a managed skill refers to the exact project dependency, compare the
  exact installed package version from the lockfile. Do not replace the
  `latest` dependency declaration merely to record a verified baseline.
- Before learner work, check for a newer project release. Start from a verified
  commit, run `bun update @fellowhumans/pathmx`, then run `bun run
  check:candidate` and smoke-test Player routes, questions, annotations, and
  components.
- After a passing candidate, set `pathmxCompatibility.baseline` to the exact
  installed package version and run `bun run check` before committing the
  refreshed lockfile. Otherwise restore only `package.json` and `bun.lock`,
  reinstall with `--frozen-lockfile`, and report the incompatibility. Do not
  rewrite learner data to force an update.
- Inspect the updated command help before using new syntax.
- `bun run check` includes a private compatibility fixture for questions,
  annotations, and the bundled component. Keep it out of the learner's path
  map and update it only with fixture-verified syntax.

## Learning contract

- One learner may have many paths, but exactly one path is foreground work.
- Keep `paths/index.path.md` as the single configured Player root. Link learner
  Path Sources from home; do not add each one to `pathmx.config.md` or invent
  `handle` frontmatter for it.
- Confirm Point A, Point B, constraints, and presentation preferences before
  building a substantial path.
- Show a 3–7 milestone map. Fully prepare only the current module: 2–4
  uninterrupted sessions, review help, and a milestone checkpoint.
- If the learner asks to see the map first, write and link the proposed Path
  Source with 3–7 statused milestones and evidence targets, then stop. Give its
  exact Player URL. Update both learner profile and activity current state to
  name the same foreground Path. Do not author sessions, review, or the
  checkpoint until the learner explicitly confirms it.
- Do not make the learner wait for an agent between ordinary lesson Blocks.
  Put hints, rationale, examples, and smaller or stretch variants in Player.
- When a confirmed module has at least two independent later outputs, the
  parent may use bounded direct workers for later-session, review, checkpoint,
  research, or fact-checking work. The parent still owns the first session,
  learner state, integration, verification, and handoff. Do not promise that a
  named worker changes models or makes the module faster.
- Adapt at session or module boundaries. Gate only real dependencies.
- Track milestones as `planned`, `ready`, `in progress`, `demonstrated`, or
  `paused`.
- Preserve completed work, evidence, and learner annotations. Change future
  plans without rewriting learning history.

## Presentation

- Begin with the neutral readable theme in `paths/index.path.md` and
  `paths/theme.css`.
- Ask the learner for a mood, color direction, light/dark/system preference,
  and any chosen text-size, contrast, or motion needs.
- Translate confirmed preferences into existing theme tokens and the clearly
  marked variables in `paths/theme.css`. Keep focus, contrast, and structure
  stable.
- Prefer ordinary Markdown and the optional components in
  `paths/assets/learning.components.md`. Create bespoke components only when
  they materially improve the learning activity.

## Player loop

- Keep one correct `bun run play` server active while authoring.
- Reuse a verified server for this repository. Never stop an unknown process.
- After changing a Source, resolve the exact route with `bunx pathmx route` and
  open it in the integrated browser when available. Otherwise use the user's
  default browser and share a clickable URL.
- Link the learner to the narrowest useful Source, Block, or Beat and explain
  when Play mode is useful.
- Before handoff, verify each session has a worked example, optional hint or
  smaller attempt, and immediate rationale, self-check, or rubric. Name the
  ready runway, give the exact start URL, and say when to return.
- Treat annotations as asynchronous feedback. Review open threads before
  authoring the next module.

## Repository care

- Keep learner information local and private by default.
- Do not create a remote or push without explicit permission.
- Make small milestone commits after meaningful, verified changes.
- Do not edit managed files under `.agents/skills`; refresh them with
  `pathmx init --skills`.
- Run `bun run check` and inspect the Player before handoff.
