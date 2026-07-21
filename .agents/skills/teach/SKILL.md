---
name: teach
description: Design, author, revise, pilot, and review PathMX learning paths intended to be shared with multiple learners. Use automatically when an educator, subject-matter expert, team, or organization asks to create a course, workshop, curriculum, onboarding path, public guide, cohort experience, or reusable learning journey. Use learn instead for one learner's adaptive personal space.
---

# Teach with PathMX

Create a reusable learning path for a defined audience. Use the installed
`pathmx` skill for PathMX syntax, Player routes, components, and verification.

Treat the path as a product learners can take without the author present. Make
the promise, entry assumptions, journey, support, and evidence legible in the
Sources themselves.

## Frame the shared path

Establish the smallest useful brief:

1. Name the audience and the situation that brings them here.
2. State what learners should be able to do afterward.
3. Record required prior knowledge, tools, time, and access needs.
4. Name one observable final performance or artifact.
5. Decide whether the path is self-paced, facilitated, cohort-based, or a
   blend.
6. Identify the distribution or deployment context already used by the
   repository. Do not invent hosting behavior.

Ask for examples of existing paths when their audience, pacing, voice,
structure, components, or deployment should shape the work. Inspect those
examples before committing to a new house style.

Keep real learner identities, responses, and private cohort data out of the
authored path. Use fictional content in examples and tests.

## Design backward from evidence

Write a short path contract before detailed sessions:

- audience and entry assumptions;
- learner-facing promise;
- 3–7 capability outcomes in a coherent sequence;
- evidence for each outcome;
- final performance or transfer task;
- expected duration and pacing;
- support, accessibility, and facilitation boundaries.

Separate what every learner needs from optional depth. Do not make a personal
learner profile or append-only personal activity log part of a shared path.
Individual repositories may add those through `learn` after taking or adapting
the shared material.

Read the [shared path contract](./references/shared-path-contract.md) before
planning a new path or reviewing one for release.

## Map the whole learner journey

Make the complete path visible before filling every lesson. Give each module:

- one capability destination;
- an entry condition when sequencing matters;
- complete sessions that can be taken without an author turn;
- embedded help and immediate feedback;
- an observable check tied to the destination;
- a clear next step.

Use the shared PathMX [library](../pathmx/library/index.md). Start from the
[shared-path template](../pathmx/library/templates/teach/path/index.path.md)
and the [shared-module template](../pathmx/library/templates/teach/module/)
when they fit. Reuse a library component only when it improves comprehension
or feedback.

Author in useful releases. Fully prepare the first module and enough adjacent
material to test navigation and progression. Keep later module maps concrete
but easy to change until examples, subject review, or a pilot justify deeper
production. Do not label a partial path complete.

## Author for independent use

Give every session a complete arc:

1. Orient learners to the value, destination, and session map.
2. Model the capability with a concrete worked example.
3. Guide a supported attempt with optional hints or a smaller version.
4. Ask for independent, varied, or transfer practice.
5. Provide an answer rationale, comparison, self-check, or rubric.
6. Offer a brief reflection or annotation prompt when it will inform revision.
7. Close with the practiced capability and an exact next step.

Write in the audience's language. Explain prerequisites before depending on
them. Keep ordinary Markdown readable outside Play mode. Use Blocks and Beats
for learning rhythm, not decoration.

Distinguish learner-facing Sources from author or facilitator notes. Never
leak answer keys through visible navigation or assume a facilitator will repair
missing instructions live.

## Build support into the path

Provide help at the point of need:

- a staged hint;
- a smaller attempt;
- another example;
- a rationale or rubric after an attempt;
- an optional challenge;
- recovery and re-entry guidance.

Use annotations as product feedback when the deployment supports them. Review
patterns of confusion, accessibility friction, and dead ends; revise the path
without overwriting learner-owned responses or comments.

## Review before sharing

Review the path in four passes:

1. **Learning:** outcomes, practice, feedback, and checks align.
2. **Journey:** entry, navigation, pacing, recovery, and completion are clear.
3. **Access:** narrow screens, keyboard use, contrast, reduced motion, media
   alternatives, and required tools are handled.
4. **PathMX:** links, routes, questions, components, build output, and Player
   behavior pass against the repository's pinned version.

Use fictional learner runs for smoke testing. Pilot with representative
learners when available, distinguish observed evidence from author opinion,
and record unresolved release risks.

Resolve the exact starting Source with `bunx pathmx route`. At handoff, give
the verified start URL or repository-relative entry, duration, prerequisites,
ready scope, and any facilitator or deployment assumptions.

## Boundaries

- Use `learn` for one learner's durable adaptive space.
- Use `pathmx` for syntax and tooling details.
- Preserve the destination repository's conventions and pinned PathMX version.
- Copy library assets into the destination; do not make learner Sources depend
  on an installed skill directory at runtime.
- Treat external deployment behavior as version-sensitive and verify it from
  the provided repository or deployment example.
- Do not claim broad effectiveness from one pilot or one completion metric.
