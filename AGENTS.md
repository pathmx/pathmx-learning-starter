# PathMX Learning Workspace

This repository is the current user's learning workspace: the durable home for
their goals, learning paths, lessons, progress, and evidence. Treat the files
here — not the chat transcript — as the record of the learner's journey.

## How to work here

- Use the **learn** skill (`/learn`) to run learning sessions. It owns the
  workflow: the learning loop, A/B points, lessons, assessments, and records.
- Use the **pathmx** skill whenever authoring PathMX content. Follow its
  references for markdown structure, the player, and literate components.
- PathMX presents the curriculum in a web player. `pathmx play paths/index.path.md`
  runs a live server that rebuilds on save and pushes updates to the player.
- Author new content block-by-block so the learner can watch it build in
  their player.
- When sharing new content with the learner, link the local server URL to the
  exact source and block they should focus on, and add `?play` to start them
  in the player.

## Workspace shape

```text
paths/
├── index.path.md               # the learner's home (root source)
├── learner.persona.md          # learner profile
├── learning.activity.md        # global record of syntheses and evidence
├── theme.css                   # shared styling for the whole space
├── assets/
│   └── learning.components.md  # reusable literate components
└── <path-name>/
    ├── index.path.md           # path structure + progress
    ├── path.outcome.md         # A baseline, B goal, rubric
    └── lessons/<lesson-name>/
        ├── index.lesson.md     # start/destination frontmatter + blocks
        └── lesson.assessment.md
```

The `welcome/` path is a maintained worked example of these conventions —
mimic it when creating new paths.

## Guardrails

- Keep the learner's record in Sources, never only in chat history.
- Do not commit credentials, private links, or sensitive personal information.
  Keep the persona limited to what the learner explicitly shares.
- Verify authored changes with `pathmx build paths/index.path.md -o .pathmx-check --clean`
  and review every warning; check presentation changes in `pathmx play`.
