# PathMX Learning Workspace

This repository is the learner's durable record. Keep goals, paths, lessons,
progress, and evidence in Sources rather than only in chat.

## Workflow

- Use `/path` to start or resume one personal learning path.
- Use `/pathmx` when authoring or verifying PathMX Sources.
- Read the root Path, learner profile, activity log, and current path before
  continuing a learning session.
- Build only the first or next lesson. Advance after reviewed evidence and a
  recorded synthesis.
- Keep learner context confirmed, useful, and minimal.

## Workspace shape

```text
paths/
├── index.path.md
├── learner.profile.md
├── learning.activity.md
├── theme.css
├── assets/
│   └── learning.components.md
└── <path-name>/
    ├── index.path.md
    ├── path.outcome.md
    ├── lessons/<lesson-name>/
    │   ├── index.lesson.md
    │   └── lesson.assessment.md
    └── references/
        └── index.references.md
```

The `welcome/` path is the maintained example.

## Guardrails

- Do not edit synced files under `.agents/skills/`.
- Do not commit credentials, private links, or sensitive learner data.
- Use relative Source and asset links.
- Do not invent PathMX syntax.
- Use only the built-in question mappings documented by `/pathmx`.
- Do not author general actions or spaceholders yet.
- Build into `.pathmx-check`, never a live `.pathmx` directory.
- Review warnings and use the Player for presentation or interaction changes.
