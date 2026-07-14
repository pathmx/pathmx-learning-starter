# PathMX Learning Starter Instructions

Start by reading `README.md` and `paths/index.path.md`.

## Purpose

Keep this repository a clean, reusable learning starter. Experiments belong in
`paths/labs/`; move them into a maintained topic only after they improve the
learner journey.

## Authoring

- Use ordinary readable Markdown as the source of truth.
- Use type-hinted filenames such as `.path.md`, `.guide.md`, `.lab.md`,
  `.persona.md`, and `.components.md`.
- Use relative Markdown links between Sources.
- Separate major playable moments with `---` on its own line.
- Make each block one coherent learning move: orient, explain/model, practice,
  feedback/reflection, or next step.
- Write complete valid blocks rather than streaming partial Markdown into a
  live Source.
- Do not invent one-off PathMX directives or authored schema fields.

Use the repo-local `pathmx-authoring` skill for substantive learning-content
work.

## Working rules

- Check `git status` before editing and preserve work you did not create.
- Keep `main` runnable and make one outcome per short-lived branch.
- Avoid adding dependencies, scripts, or configuration until a real workflow
  requires them.
- Never commit credentials, private invitation links, raw agent transcripts,
  or sensitive learner data.

## Verification

For authored-source changes:

```sh
pathmx build -o .pathmx-check
```

Use `pathmx play` for visual review. Do not use the default `.pathmx` directory
for scratch verification while a Player may be running.
