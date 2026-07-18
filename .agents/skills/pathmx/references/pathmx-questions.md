# PathMX Questions and Responses

Use one stable question Block for each durable learner response. Keep the
prompt readable as ordinary Markdown.

## Single choice

Use a heading, at least two top-level list options, and the built-in mapping:

```md
---

<!--
type: question
id: source-of-truth
actions:
  submit: questions.submitSingleChoice
-->

## Where should durable learning evidence live?

- Only in chat
- In readable Markdown Source
- Only in browser state
```

PathMX derives stable option values from the labels. Keep option labels unique.

## Short and long text

Set `question.type` to `short` or `long` and use
`questions.submitText`:

```md
---

<!--
type: question
id: explain-choice
question:
  type: long
actions:
  submit: questions.submitText
-->

## Explain why you chose that answer.
```

A short response is one line with at most 300 UTF-16 code units. A long
response has at most 2,000. A text question has exactly one heading and no
top-level list options.

## Response fields

Use `question.type: fields` and `questions.submitFields` when one prompt needs
several short values:

```md
---

<!--
type: question
id: study-plan
question:
  type: fields
actions:
  submit: questions.submitFields
-->

## Make a study plan.

Practice for **___**<!-- @response.field id=minutes label="Minutes" placeholder="e.g. 20" --> minutes on **___**<!-- @response.field id=topic label="Topic" -->.
```

Field ids use lowercase letters, digits, and hyphens. Fields are required by
default. Add `required=false` to make one optional.

## Durable evidence

Submission writes learner-owned data into the Block topmatter:

```yaml
response:
  text: A learner response
submission:
  status: submitted
  run: run-id
```

Single choice uses `response.choice`. Response fields use their field ids as
keys under `response`.

- Do not prefill `response` or `submission` for the learner.
- Preserve an answered Block's stable `id` and question type.
- Use a new Block when the evidence target changes.
- Let an agent or reviewer compare the response with the assessment rubric.
  PathMX does not grade it automatically.

## Verification

1. Build with the repository's installed PathMX version.
2. Check that each question renders one normal form and the expected control.
3. In the Player, submit a disposable or intended learner response.
4. Confirm the Source gains `response` and `submission` data.
5. Reload and confirm the control restores the saved response.

These built-in question mappings are supported. Do not infer a general Action
authoring contract from them.
