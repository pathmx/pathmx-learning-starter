# Worked Example

This compact SQL example shows the durable shape of one buffered module. It is
not a required topic or exact file count.

## Path map

`paths/sql-foundations/index.path.md`:

```md
---
type: path
status: active
---

# SQL Foundations

**Point A:** Can filter one table. Joins are unfamiliar.

**Point B:** Can build and explain a small support report across related tables.

## Milestones

- **Choose rows from one table:** demonstrated
- **Combine related tables:** in progress
- **Summarize joined results:** planned
- **Build the support report:** planned

## Current module

[Combine related tables](./modules/01-combine-tables/index.path.md)
```

## Current module

`paths/sql-foundations/modules/01-combine-tables/index.path.md`:

```md
---
type: path
status: ready
---

# Combine Related Tables

**Destination:** Choose `INNER JOIN` or `LEFT JOIN`, write the join condition,
and explain which unmatched rows remain.

1. [See what a join preserves](./01-rows-that-survive.lesson.md)
2. [Choose the join from the question](./02-choose-the-join.lesson.md)
3. [Optional review](./review.practice.md)
4. [Milestone checkpoint](./milestone.assessment.md)
```

Both sessions exist before the learner starts the module.

## One uninterrupted session

`01-rows-that-survive.lesson.md`:

````md
---
type: lesson
status: ready
---

# See What a Join Preserves

By the end, you will predict which ticket rows survive an `INNER JOIN` and a
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

What changes if `LEFT JOIN` becomes `INNER JOIN`?

Write one sentence before continuing.

---

<!-- id: rationale -->

## Compare your prediction

`INNER JOIN` keeps only tickets with a matching customer. The important
question is not “Which keyword do I remember?” but “Which rows must survive?”

---

<!-- id: independent-check -->

## Apply it

Choose a join for a report that must include every ticket, then explain the
choice. Use the optional review if the row-survival rule is still fuzzy.

[Continue to Session 2](./02-choose-the-join.lesson.md)
````

The learner can complete the session without another agent turn. They may
annotate any confusing explanation for later review.

## Milestone checkpoint

The checkpoint asks for one small support query and explanation. The agent
compares that artifact with the module's evidence target, records a synthesis
in `paths/learning.activity.md`, and either marks the milestone demonstrated or
prepares focused review.

The next module starts from that recorded evidence, not from a generic course
sequence.
