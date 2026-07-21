---
type: assessment
status: ready
---

# Combine Related Tables Checkpoint

Write a query that keeps every ticket when some customer records are missing.

---

<!--
type: question
id: join-explanation
question:
  type: long
actions:
  submit: questions.submitText
-->

## Explain your choice

Explain why the other join would drop rows and identify the matching keys.

---

<!-- id: evidence-target -->

## Evidence target

- Uses `LEFT JOIN` with tickets on the left.
- Joins `customers.id` to `tickets.customer_id`.
- Explains what happens to unmatched ticket rows.

After agent review, record the evidence and placement decision in the
[activity log](../../../learning.activity.md).
