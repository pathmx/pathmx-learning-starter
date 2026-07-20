---
type: path
status: active
actions:
  coach-begin: learning.beginTurn
  coach-apply: learning.applyTurn
  coach-fail: learning.failTurn
theme:
  measure: 54rem
  prose:
    size: 1.05rem
    leading: 1.6
---

<!--
type: question
id: learning-goal
question:
  type: fields
actions:
  submit: questions.submitFields
-->

# Build a path around your goal

Tell us enough to make the first few steps useful. You can refine the path as
you learn.

> **What would you like to learn?**<br>
> ___<!-- @response.field id=topic label="What would you like to learn?" placeholder="e.g. Understand the greenhouse effect" -->
>
> **What would you like to be able to do?**<br>
> ___<!-- @response.field id=outcome label="What would you like to be able to do?" placeholder="e.g. Explain it with an everyday example" -->
>
> **Where are you starting?**<br>
> ___<!-- @response.field id=starting-point label="Where are you starting?" placeholder="e.g. I have a rough idea but no clear model" -->
>
> **What time can you make for this?**<br>
> ___<!-- @response.field id=time label="What time can you make for this?" placeholder="e.g. Three 20-minute sessions" -->

[@styles]: ./learning-starter.css
[coach-context]: ./coach.persona.md
