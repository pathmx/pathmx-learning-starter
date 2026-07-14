---
name: pathmx-authoring
description: Create, revise, and review playable PathMX learning Sources in this repository. Use for paths, guides, labs, learner profiles, components, exercises, curriculum links, or learning-content structure.
---

# PathMX Authoring

1. Read `AGENTS.md`, `README.md`, and `paths/index.path.md` before editing.
2. Inspect the nearest Source with the same filename role before adding a new
   pattern.
3. Write useful plain Markdown first. Add PathMX behavior only when it improves
   learning, navigation, review, or interaction.
4. Use type-hinted filenames and relative links.
5. Split major playable moments with `---` and keep one coherent learner move
   in each block.
6. Prefer the sequence: orient → explain/model → practice → feedback or
   reflection → next step. Omit stages that do not help the specific lesson.
7. Keep learner evidence and next steps readable in Sources. Do not hide the
   learning record in chat history or generated build output.
8. Keep rough experiments in `paths/labs/`. Promote only accepted work into a
   maintained topic or the root path.
9. Do not invent directives, public data shapes, or private learner fields for
   one lesson.
10. Verify with `pathmx build -o .pathmx-check`; visually inspect the relevant
    route with `pathmx play` when presentation or interaction changed.

Report the changed Sources, verification result, and any skipped check.
