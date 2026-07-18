---
type: lesson
status: active
---

# Review Before Applying

Read a proposed change before it reaches the working tree.

---

<!--
id: inspect-first
-->

## Inspect first

Ask the agent for a focused diff, then read the affected contract.

```sh [1|2]
git diff --check
git diff --stat
```

---

<!--
id: learner-task
-->

## Try it

Choose one small change. State the expected behavior and the check that will
prove it before applying the patch.
