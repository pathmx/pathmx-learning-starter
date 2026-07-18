# Worked Example

This SQL path shows five files at one point in the learning loop.

## `paths/sql-foundations/path.outcome.md`

```md
---
type: outcome
status: active
---

# SQL Foundations Outcome

## Point A

Can filter one table with `SELECT` and `WHERE`. Joins are unfamiliar.

## Point B

Can answer support questions that require combining two tables.

## Rubric

- Chooses `INNER JOIN` or `LEFT JOIN` for the required rows.
- Writes the join condition correctly.
- Explains which unmatched rows remain.
```

## `paths/sql-foundations/index.path.md`

```md
---
type: path
status: active
---

# SQL Foundations

[Outcome and rubric](./path.outcome.md)

---

## Current lesson

- [ ] [Joining tables](./lessons/joins/index.lesson.md)

## Later

- Aggregation and `GROUP BY`
- A small support report
```

## `paths/sql-foundations/lessons/joins/index.lesson.md`

````md
---
type: lesson
status: active
start: Can filter one table; joins are unfamiliar
destination: Can choose and write INNER or LEFT JOIN and explain which rows remain
---

# Joining Tables

## Recall

From memory, what does `WHERE` remove from a result?

---

## Two tables

```sql
SELECT t.id, c.name
FROM tickets t
INNER JOIN customers c ON c.id = t.customer_id;
```

---

## Keep unmatched tickets

Change `INNER JOIN` to `LEFT JOIN`. Predict the difference before running it.

[Take the assessment](./lesson.assessment.md)
````

## `paths/sql-foundations/lessons/joins/lesson.assessment.md`

```md
---
type: assessment
status: ready
---

# Joining Tables Assessment

## Evidence target

Choose and write `INNER JOIN` or `LEFT JOIN`, then explain which unmatched rows
remain.

## Transfer task

Write a query that lists every ticket, including tickets whose customer record
is missing. Return the ticket ID and customer name.

Save the query and a short explanation in a file, then link that artifact from
the activity log.

## Rubric

- Uses `LEFT JOIN`.
- Joins the correct keys.
- Keeps all ticket rows.
- Explains why an `INNER JOIN` would drop some tickets.

The next lesson stays gated until the evidence meets this rubric.
```

## `paths/learning.activity.md`

```md
---
type: activity
---

# Learning Activity

---

<!--
id: joins-complete
date: 2026-07-18
-->

## Synthesis: joins

**Evidence:** [Joining tables assessment](./sql-foundations/lessons/joins/lesson.assessment.md)
meets the rubric; the linked work uses `LEFT JOIN` and explains unmatched rows.

**Shift:** The learner now treats join choice as a statement about which rows
must survive, not as syntax to memorize.

**Opens next:** Aggregate the joined results by customer segment.
```

The next lesson starts from the final synthesis, not from a generic sequence.
