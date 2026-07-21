---
type: path
status: active
---

# PathMX compatibility fixture

This Source is build evidence for version updates. It is not learner content.

---

<!--
type: question
id: compatibility-choice
actions:
  submit: questions.submitSingleChoice
-->

## Does the question control render?

- Yes
- No

---

<!--
type: annotation-fixture
id: compatibility-annotation
-->

This sentence has a durable annotation.[^c1]

[^c1]: **@learner** (2026-01-01 00:00 +00:00): Compatibility
    evidence only.

---

<!--
type: component-fixture
id: compatibility-component
-->

<learning-reveal label="Compatibility reveal">
  <slot name="prompt">Prompt stage</slot>
  <slot name="hint">Hint stage</slot>
  <slot name="answer">Answer stage</slot>
</learning-reveal>

[@learning]: ../assets/learning.components.md
