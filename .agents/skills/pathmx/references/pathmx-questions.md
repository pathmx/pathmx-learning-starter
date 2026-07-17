# PathMX Questions & Responses

<!-- TODO: draft. Ground truth: pathmx repo — plugins/core/{questions,responses,
     tasks}/, paths/demos/question-text-responses.demo.md. -->

Authoring questions, tasks, and durable learner responses.

## Question blocks

<!-- TODO: a question is a Block with comment topmatter carrying
     `type: question`, a stable `id`, a `question.type`, and one Action
     Mapping (e.g. `actions.submit: questions.submitText`), followed by the
     prompt as a normal heading + prose. Show the full topmatter example in a
     fenced code block when drafting (it can't nest inside this comment).
     Keep the prompt readable as plain markdown. -->

## Question types

<!-- TODO: action-backed types: `single` (top-level list items as options,
     optional explicit ids), `short`, `long`, `fields` (inline
     `@response.field` blanks). Parsed-only (no built-in submit yet):
     `multiple`, `number`, `rating`. -->

## Tasks

<!-- TODO: GFM task lists `- [ ]` stay portable markdown; durable submission
     requires an Action Mapping and a Host — don't infer persistence from
     checkboxes alone. -->

## Responses

<!-- TODO: submissions save readable `response.choice` / `response.text` plus
     `submission` metadata into stable Block data. -->

## Copy guidelines

<!-- TODO: learner-facing copy covers only the learner's goal/decision; keep
     persistence, provenance, and agent details out of the prompt. -->
