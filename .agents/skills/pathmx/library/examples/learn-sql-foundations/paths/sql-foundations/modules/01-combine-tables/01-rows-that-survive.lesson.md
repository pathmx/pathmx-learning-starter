---
type: lesson
status: ready
estimatedMinutes: 20
---

# See What a Join Preserves

By the end, predict which ticket rows survive an `INNER JOIN` and a
`LEFT JOIN`.

---

<!-- id: worked-example -->

## Start with one worked example

```sql
SELECT t.id, c.name
FROM tickets t
LEFT JOIN customers c ON c.id = t.customer_id;
```

A `LEFT JOIN` keeps every ticket. When a customer record is missing, the
customer columns are empty instead of the ticket disappearing.

---

<!-- id: guided-attempt -->

## Predict before revealing

Write one sentence predicting what changes if `LEFT JOIN` becomes
`INNER JOIN`.

---

<!-- id: rationale -->

## Compare your prediction

`INNER JOIN` keeps only tickets with a matching customer. Ask “Which rows must
survive?” before choosing the keyword.

---

<!-- id: independent-check -->

## Apply it

Choose a join for a report that must include every ticket, then explain the
choice. Continue to [Session 2](./02-choose-the-join.lesson.md) without waiting
for an agent.
