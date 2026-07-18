---
name: path
description: Create and resume an opinionated personal learning path in a PathMX workspace. Use assessment evidence to choose the next lesson for one learner and one learning goal.
---

# Personal Learning Path

Build one durable, adaptive path for one learner. Use `/pathmx` for PathMX
syntax and verification.

## Learning loop

Run the same loop at path and lesson level:

1. **Assess position.** Find the learner's current capability from work or a
   short diagnostic.
2. **Aim.** Agree on a measurable destination and evidence rubric.
3. **Experience.** Build one lesson at the proximal edge.
4. **Assess outcome.** Compare durable evidence with the rubric.
5. **Record and advance.** Write a synthesis, update the current position, and
   choose the next lesson.

Do not build the whole path ahead. The next lesson depends on the current
lesson's evidence and synthesis.

## Start or resume

Before teaching, read the nearest repository instructions and root Path
Source. Reuse the workspace's layout when one exists.

For a new path:

1. Ask what the learner wants to be able to do.
2. Find Point A with a brief assess-by-doing task when practical.
3. Define Point B and a small rubric with the learner.
4. Create the path outline. Build only the first lesson and assessment.

For a returning path:

1. Read the learner profile, activity log, active path, latest assessment, and
   latest synthesis.
2. Give a short recap.
3. Use two or three retrieval prompts from earlier work.
4. Continue from the recorded position.

Record only learner-confirmed context. Avoid sensitive data by default.

## Build one lesson

1. Set `start` from the current position and latest synthesis.
2. Set `destination` as an observable learner capability.
3. Teach one small win at the proximal edge.
4. Add retrieval, practice, and immediate feedback.
5. Write a plain Markdown assessment tied to the destination.
6. Ask for a linked artifact or written response that can be reviewed later.
7. Gate the next lesson on evidence, not “I finished.”
8. If evidence shows a gap, revise or add a smaller lesson and reassess.
9. Record a synthesis: evidence, change in perspective, and what opens next.

If the installed tools cannot capture suitable evidence, report the capability
gap. Do not weaken the assessment.

## Default layout

This is `/path`'s default, not a general PathMX requirement:

```text
paths/
├── learner.profile.md
├── learning.activity.md
└── <path-name>/
    ├── index.path.md
    ├── path.outcome.md
    ├── lessons/
    │   └── <lesson-name>/
    │       ├── index.lesson.md
    │       └── lesson.assessment.md
    └── references/
        └── index.references.md
```

- `path.outcome.md` records Point A, Point B, and the path rubric.
- `index.path.md` records the outline and current position.
- `index.lesson.md` records the lesson's historical `start` and `destination`.
- `lesson.assessment.md` asks for observable evidence.
- `learning.activity.md` records evidence, goal changes, and synthesis.

Renegotiate Point B explicitly when evidence changes the learner's goal. Log
the change; do not rewrite history silently.

## Learning rules

- Use backward design: define evidence before content.
- Teach at the zone of proximal development.
- Use retrieval, spacing, and interleaving to build storage strength.
- Keep lessons small and concrete.
- Prefer real transfer tasks over recall alone.
- Advance on evidence, not fluency or impressions.

See the [worked example](./references/worked-example.md).
