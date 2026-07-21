---
name: learn
description: Start, plan, guide, and resume personal learning in a PathMX learning space. Use automatically when one learner asks to learn, study, practice, build a personal curriculum, continue a learning path, review progress, or turn a goal into guided lessons, including when a new personal learning repository must be created. Use teach instead when authoring one path for multiple learners.
---

# Learn with PathMX

Build a durable personal learning space for one learner. Use the installed
`pathmx` skill for PathMX syntax, Player routes, and verification.

Keep the learner moving. Prepare a coherent runway of material, then adapt at
meaningful boundaries. Never require an agent turn between ordinary lesson
Blocks.

## Open or create the space

If no learning repository exists, carry out the same setup as the hosted
bootstrap:

1. Ask where to create a new directory.
2. Ensure Bun is installed.
3. Install or update the native command with `pathmx self-update`, or
   `bunx @fellowhumans/pathmx@latest self-update` when it is missing.
4. Run
   `pathmx init <learning-space> --template pathmx-learning-starter`.
5. Install the lockfile, initialize local Git, and commit the verified scaffold
   baseline.
6. Compare the exact project dependency with the freshly updated native
   `pathmx --version`. If they match, run the normal check once instead of
   reinstalling the same package. If they differ, attempt the latest project
   dependency as the version migration described in the `pathmx` tooling
   reference. Keep it only after the full build and Player smoke pass;
   otherwise restore the baseline version files.
7. Read the new repository instructions and continue there.

Shell tool calls may not preserve a prior `cd`. Set the new repository as the
working directory, or prefix every project command with an explicit `cd`, so
install, verification, Player, and route commands run in the intended space.

Never replace an existing directory or create a remote without permission.
Treat the space as private personal data.

For an existing space, read the root Source, learner profile, activity log,
active path, current module, latest checkpoint, and unresolved annotations.
Read only the history needed to continue.

## Ask a small onboarding set

Ask a few questions at a time:

1. What does the learner want to be able to do, and why?
2. What do they already know or find difficult?
3. What small artifact, example, explanation, or diagnostic can show their
   current position?
4. How much time and energy can they usually give a session?
5. What learning feel helps: direct, conversational, exploratory, practical,
   visual, or another preference?
6. What visual mood, color direction, light/dark preference, readability need,
   or motion sensitivity should shape the Player?

Save only learner-confirmed, learning-relevant context. Do not solicit private
credentials or unnecessary sensitive information.

## Map visible progress

Turn onboarding evidence into:

- **Point A:** an observable current capability, citing the evidence;
- **Point B:** the capability the learner wants;
- **3–7 milestones:** named capabilities between A and B;
- **evidence targets:** what demonstrates each milestone;
- **current module:** 2–4 sessions with one coherent purpose;
- **later modules:** provisional titles and outcomes.

Write the proposed map into the learning repository before showing it to the
learner. Use the shared
[`library/templates/learn/path/index.path.md`](../pathmx/library/templates/learn/path/index.path.md)
scaffold so every one of
the 3–7 milestones has one visible `planned`, `ready`, `in progress`,
`demonstrated`, or `paused` status plus an evidence target. Link the proposed
foreground Path from the home Source. This first useful artifact should be
available in Player before the learner waits for the substantial module build.
Update the learner profile and the activity record's current state in the same
change so they agree on the foreground Path.

In the learning starter, keep `paths/index.path.md` as the single configured
Player root. A learner's individual Path is a nested Source linked from home,
not another `pathmx.config.md` Path entry. Rebuild the home graph after linking
it; do not add Source `handle` frontmatter to make ordinary nested routes work.

Show the learner that persisted map and confirm it before teaching. Keep
exactly one foreground path while allowing other paths to remain paused or
completed.

When the learner asks to see the map first, stop after writing and linking the
proposed Path Source. Do not create session, review, or checkpoint Sources in
that turn. Give its exact Player URL, label it as a proposal, and wait for
explicit confirmation of Point B, the milestone map, and the proposed current
module. A request to show a map is not confirmation.

Do not fully author the entire future curriculum. Fully author the current
module and keep later modules easy to change.

After the persisted map is visible, use background workers when the agent
surface supports them to gather low-risk subject research, prerequisite risks,
or candidate examples while the learner reviews the proposal. Do not draft
session Sources before confirmation. Keep the parent agent available for the
learner's reply, and stop or redirect work when the goal changes.

## Build a learning runway

Prepare all sessions in the current module before asking the learner to begin.
Keep optional consolidation or retrieval material ready so a slow agent never
blocks learning. Let the learner continue without waiting for another agent
turn.

Before calling the module ready, check every session for a worked example, an
optional hint or smaller attempt, and an immediate rationale, self-check, or
rubric. Keep focused review and an optional stretch task ready in the module.

For a standard two-session module, copy the shared
[`library/templates/learn/module/`](../pathmx/library/templates/learn/module/)
scaffold into the new module directory and replace its author notes. Add or
remove session files only when the learner's confirmed rhythm calls for it.

When subagents are available, let the parent agent write the confirmed module
contract, shared vocabulary or scenario, index, and session skeletons first.
Then delegate only bounded, independent work:

- research or fact-check the subject, prerequisites, and examples;
- draft distinct later session, review, or checkpoint Sources with one owner
  per file;
- review completed drafts for learning alignment, accessibility, and PathMX
  correctness.

The parent agent owns the learner conversation, the first session, shared
indexes, profile and activity state, integration, and final verification. Give
workers only the confirmed outcomes and minimum learning-relevant context; do
not expose unnecessary personal details. Prefer two or three direct workers,
do not ask them to delegate further, and never let concurrent workers edit the
same file. If delegation is unavailable or coordination would take longer than
the work, continue locally without blocking the learner.

Give workers the same terminology, example or data model, prerequisites, and
link targets. Ask each authoring worker for one focused build or content check;
the parent runs the full repository check once after integration. Set the join
point before learner handoff. If a worker misses it, the parent completes or
reassigns that output instead of making the learner wait.

Work in visible stages when the agent surface supports progress updates:

1. Create the module index, contract, and session skeletons; start any bounded
   workers; then report that the runway exists.
2. Fill the first session while independent later Sources are prepared, then
   report the concrete capability now ready.
3. Integrate and review every session, review, and checkpoint, then report that
   the uninterrupted module is ready for verification.
4. Run one targeted build or route check, then one full check before handoff.

Keep these updates factual and brief; they are learner-visible progress, not
requests for another reply. Reuse the active Player. Do not repeat installation,
migration, or full compatibility checks within the same healthy task.

Design each session for roughly 15–30 minutes unless the learner chose another
pace. Give it a complete arc:

1. **Orient.** State why this matters, the destination, and the session map.
2. **Model.** Explain with a concrete example or worked example.
3. **Guide.** Offer a supported attempt with optional hints.
4. **Apply.** Ask for an independent or transfer attempt.
5. **Check.** Provide immediate self-check, rationale, or a clear rubric.
6. **Reflect.** Invite a short note, question, or annotation.
7. **Complete.** Summarize the capability practiced and what comes next.

Use Blocks for meaningful phases and Beats for useful reveals. Do not turn
every sentence into a Beat. Make the session readable outside Play mode.

## Provide immediate and slower feedback

Build attractive, structured Player support that works without an agent turn:

- show a hint;
- inspect a worked example;
- try a smaller version;
- reveal a rationale or rubric after an attempt;
- choose an optional stretch task.

Use existing starter components when they fit. Create bespoke Literate
Components only when they improve the learning experience.

Treat annotations as an asynchronous curriculum-feedback inbox. Encourage the
learner to mark confusion, disagreement, useful ideas, or requests for more
depth. On return, review open annotations, reply or revise future material, and
resolve threads only when addressed. Preserve learner-authored comments.

## Adapt at useful boundaries

Use session checks as low-stakes evidence. Let the learner continue through a
module with small uncertainties when later work does not depend on them.

At the module checkpoint:

1. Review work, responses, reflections, and annotations.
2. Compare the evidence with the milestone target.
3. Mark the capability demonstrated, keep it in progress, or offer focused
   review.
4. Update current Point A and prepare the next module.
5. Record a short synthesis and the reason for placement.

After checkpoint evidence is durable, a read-only worker may summarize the
evidence against the existing rubric while another researches the likely next
module. The parent agent must make the placement decision, write Point A and
activity changes, prepare remediation or the next module, and explain the
decision to the learner. Never wait for optional worker output before
acknowledging the learner or answering a direct question.

Gate progression only when a later capability genuinely depends on a missed
core idea. After repeated difficulty, provide a smaller remediation module or
renegotiate the goal or pace. Do not trap the learner in a remediation loop.

## Personalize presentation

Start from the repository's readable default theme. Translate confirmed style
preferences into a small set of theme tokens: color, surface, typography,
measure, contrast, and motion. Keep navigation and learning structure stable.

Prefer restrained personalization over a bespoke interface. Check contrast,
narrow screens, keyboard use, reduced motion, and both requested color modes.

## Keep the Player live

Reuse a healthy Player server that belongs to the repository or start
`bun run play` in a long-lived terminal. Resolve the exact Source route with
`bunx pathmx route` and link to the useful Source, Block, or Beat position.

Open and review learner-facing work in an integrated browser when available.
In Codex, prefer `@Browser`; in Claude Code, use its Chrome integration when
already configured. Otherwise use the system browser or provide a clickable
URL. Teach first-time learners with the bundled Player tutorial.

At handoff, give the exact starting URL, say how to enter and navigate Play
mode, name the ready sessions, and tell the learner when to return for review.

## Default layout

Use the starter's layout when present. The portable default is:

```text
paths/
├── index.path.md
├── getting-started/
│   └── player.lesson.md
├── learner.profile.md
├── learning.activity.md
├── theme.css
├── assets/
│   └── learning.components.md
└── <path-name>/
    ├── index.path.md
    ├── path.outcome.md
    └── modules/
        └── 01-<module-name>/
            ├── index.path.md
            ├── 01-<session>.lesson.md
            ├── 02-<session>.lesson.md
            ├── review.practice.md
            └── milestone.assessment.md
```

- `paths/index.path.md` is the personal learning home.
- `learner.profile.md` stores confirmed learning and style preferences.
- `learning.activity.md` is an append-only record of evidence, syntheses, and
  placement decisions.
- A path index shows Point A, Point B, milestones, progress, and the current
  module.
- A module index links its fully prepared sessions and checkpoint.
- Completed Sources remain history. Do not silently rewrite past evidence.

Read the [buffered loop](./references/buffered-loop.md) when planning or
changing a path. Use the shared PathMX [library](../pathmx/library/index.md) to
choose verified patterns, templates, components, and examples. The compact
[SQL example](../pathmx/library/examples/learn-sql-foundations/paths/sql-foundations/index.path.md)
shows one complete personal module.

## Learning rules

- Use backward design: name evidence before detailed content.
- Use the proximal edge to choose difficulty, not generation cadence.
- Prefer worked examples for novices, then fade support.
- Use retrieval, spacing, interleaving, practice, and transfer deliberately.
- Keep sessions concrete and finishable.
- Adapt from evidence without making the learner wait unnecessarily.
- Renegotiate Point B explicitly when the learner's goal changes.
