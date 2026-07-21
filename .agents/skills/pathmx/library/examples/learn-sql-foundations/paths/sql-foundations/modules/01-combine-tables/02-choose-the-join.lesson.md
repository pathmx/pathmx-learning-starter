---
type: lesson
status: ready
estimatedMinutes: 20
---

# Choose the Join From the Question

By the end, translate a reporting requirement into a join choice and condition.

---

<!-- id: model -->

## Model the decision

“Show every customer, including customers with no tickets” means customers are
the left table and the query needs a `LEFT JOIN`.

---

<!-- id: guided-practice -->

## Try two cases

1. Show only tickets with a valid customer.
2. Show every ticket, even when its customer record is missing.

For each case, name the left table, join type, and matching keys.

---

<!-- id: self-check -->

## Check your reasoning

Case 1 may use `INNER JOIN`. Case 2 needs tickets on the left with a
`LEFT JOIN`. In both cases, match `customers.id` to `tickets.customer_id`.

Use the [focused review](./review.practice.md) if row survival is still fuzzy;
otherwise continue to the [milestone checkpoint](./milestone.assessment.md).
