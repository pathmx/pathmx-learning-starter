# Worked Example: A Path Mid-Flight

One path ("SQL foundations") captured mid-journey: lesson 1 closed with a
synthesis, lesson 2 active, and one B renegotiation on record. Four files
showing the learning loop conventions in practice. Where the skill doesn't
mandate an exact convention (like how to mark the current position), these
examples pick something plausible — match the spirit, not the letter.

## `paths/sql-foundations/path.outcome.md`

````md
---
type: outcome
status: active
---

# SQL Foundations — Outcome

## Point A (baseline, captured 2026-07-02)

Dana works in support ops and lives in spreadsheets. Has run canned queries
in Metabase but never written SQL from scratch. Comfortable with formulas
and filtering; no mental model of tables/relations.

Evidence: [diagnostic lesson](./lessons/diagnostic/index.lesson.md) — could
read a simple SELECT aloud but couldn't predict its result set.

## Point B

Can answer real support-ops questions (ticket volume, response times,
customer segments) directly against the warehouse, unaided, in under 15
minutes per question.

*Revised 2026-07-10 — see [activity log](../learning.activity.md): original B
included "writes stored procedures"; dropped as not relevant to the actual
mission.*

## Rubric

- Translates a plain-English ops question into a working query without help
- Chooses the right join type and can explain why
- Sanity-checks results (row counts, NULLs) before trusting them
````

The A baseline links to its evidence (the diagnostic lesson), and the B
revision note points to the activity log where the renegotiation was
recorded.

## `paths/sql-foundations/index.path.md`

````md
---
type: path
status: active
---

# SQL Foundations

From spreadsheets to querying the warehouse directly.
[Outcome & rubric](./path.outcome.md)

---

## Module 1: Reading data

- [x] [Diagnostic: what do you already know?](./lessons/diagnostic/index.lesson.md)
- [x] [SELECT, WHERE, and reading result sets](./lessons/select-basics/index.lesson.md)
- [ ] **→ [Joining tables](./lessons/joins/index.lesson.md)** *(current)*

## Module 2: Answering real questions

- [ ] Aggregation and GROUP BY *(outlined only — built after joins closes)*
- [ ] Putting it together: the weekly ops report
````

Modules are sections of the index (not folders), later lessons are
outline-only per the never-build-ahead rule, and the current position is
just a marked list item — cheap, diffable, and visible in the player.

## `paths/sql-foundations/lessons/joins/index.lesson.md`

````md
---
type: lesson
status: active
start: Can filter one table with SELECT/WHERE; asked "how do I see the customer name next to the ticket?" — joins are unfamiliar
destination: Can combine tickets and customers with INNER and LEFT JOIN and explain which rows each keeps
---

# Joining Tables

---

<!--
id: warmup
type: warmup
-->

## Before we start

From memory — no peeking at the last lesson:

1. What does the `WHERE` clause do to the result set?
2. Write a query returning tickets opened this week.

---

<!--
id: two-tables-problem
-->

## The problem joins solve

Last lesson you asked exactly the right question: *"how do I see the
customer name next to the ticket?"* The answer is that tickets and
customers are two tables sharing a key.

```sql
SELECT t.id, t.subject, c.name
FROM tickets t
INNER JOIN customers c ON c.id = t.customer_id;
```

---

<!--
id: left-join
-->

## What INNER quietly drops

```sql [1-2|3]
SELECT t.id, t.subject, c.name
FROM tickets t
LEFT JOIN customers c ON c.id = t.customer_id;
```

Predict: which query returns *more* rows, and what fills the gap?

When you're ready: [take the assessment](./lesson.assessment.md)
````

The loop in miniature: `start` quotes the actual evidence from the prior
synthesis (the learner's own question), the warm-up block implements the
retrieval rule, comment topmatter gives blocks stable ids, and the fence
info `[1-2|3]` steps the second query in the player.

## `paths/learning.activity.md`

````md
---
type: activity
---

# Learning Activity

---

<!--
id: select-basics-complete
date: 2026-07-08
path: sql-foundations
-->

## Synthesis: SELECT basics

**Learned:** Writes single-table SELECT/WHERE queries unaided; passed
[assessment](./sql-foundations/lessons/select-basics/lesson.assessment.md)
(4/4, including the NULL-comparison trap).

**Shift:** Stopped thinking of the warehouse as "a big spreadsheet" —
noticed the data is *split across tables on purpose* and asked how to get
customer names next to tickets. Tables-as-relations is now the frame.

**Opens next:** Joins. Dana's real questions all span 2+ tables.

---

<!--
id: outcome-revision-1
date: 2026-07-10
path: sql-foundations
-->

## Path B revised

Original B included "writes stored procedures." Working through real ops
questions showed nothing Dana needs requires them. Renegotiated with Dana
and dropped it; B now ends at unaided querying under 15 minutes.
[Updated outcome](./sql-foundations/path.outcome.md)
````

The synthesis's three parts do the structural work: **Shift** is the
elevated vantage (spreadsheet → relations), and **Opens next** is literally
where the joins lesson's `start:` came from. The B revision is its own
dated, linked block, so the goal's evolution is reconstructible from the
log alone.
