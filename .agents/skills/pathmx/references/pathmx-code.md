# PathMX Code

PathMX uses standard fenced Markdown code blocks. Add a language after the opening fence for syntax highlighting. PathMX automatically makes each fence one Code Beat in Player mode.

## Quick reference

| Write | Result |
| --- | --- |
| `` ```js `` | JavaScript syntax highlighting |
| `` ```python `` | Python syntax highlighting |
| `` ```js [1\|2-4\|5] `` | Ordered line-step Beats |
| `` ```js [1,5\|2-4] `` | Noncontiguous lines in one step |
| `` ```js no-copy `` | Hide the copy button |
| `` ```js no-select `` | Disable code selection |

---

## Basic code fence

Put three backticks before and after the code. Write the language immediately after the opening backticks:

````md
```js
const message = "Hello, PathMX!";
console.log(message);
```
````

Rendered result:

```js
const message = "Hello, PathMX!";
console.log(message);
```

The language label controls highlighting. Use a common language name such as `js`, `ts`, `python`, `html`, `css`, `json`, `yaml`, `bash`, or `sql`. Use `text` when highlighting is not useful.

---

## Line steps in Player

Add a bracketed step specification after the language:

````md
```js [1|2-4|5]
function greet(name) {
  const message = `Hello, ${name}!`;
  console.log(message);
}
greet("PathMX");
```
````

Rendered result and live Player example:

```js [1|2-4|5]
function greet(name) {
  const message = `Hello, ${name}!`;
  console.log(message);
}
greet("PathMX");
```

Expected output:

```text no-copy
Hello, PathMX!
```

This fence produces one parent Code Beat and three child Code-step Beats:

1. Line 1 introduces the function.
2. Lines 2–4 build and print the greeting.
3. Line 5 calls the function.

### Step syntax

- Separate steps with `|`.
- Use `N-M` for a continuous range, such as `2-4`.
- Use commas for lines shown together, such as `1,5`.
- Number lines from `1`.
- Do not repeat a line in multiple steps.
- Use at least two steps; a single step has nothing to reveal.

PathMX warns during the build if a step is malformed or references a line beyond the end of the fence.

---

## Copy and selection controls

Code fences include a copy button by default. Add `no-copy` when copying would be confusing or inappropriate:

````md
```text no-copy
This example intentionally has no copy button.
```
````

Rendered result: the next Player Block contains the actual `no-copy` fence. The code renders normally, but no copy button is created.

---

id: no-copy-example
title: No-copy rendered example

# No-copy rendered example

This is a real PathMX code fence authored with `no-copy`:

```text no-copy
This example intentionally has no copy button.
```

The missing copy button above is the expected rendered behavior.

Add `no-select` when learners should not select the code. These flags can be combined:

````md
```text no-copy no-select
Read this instruction without copying it.
```
````

Rendered result:

```text no-copy no-select
Read this instruction without copying it.
```

Prefer the default copyable behavior for commands and working examples.

---

## Code in a PathMX Block

Keep setup, code, and the learner's task in the same Block when they form one focused learning step:

````md
id: greeting-function
title: Build a greeting

# Build a greeting

Read the function one step at a time, then change the name.

```js [1|2-4|5]
function greet(name) {
  const message = `Hello, ${name}!`;
  console.log(message);
}
greet("PathMX");
```

Try it: change `"PathMX"` to your name and predict the output before running it.
````

Rendered result: the next Player Block is authored from that source. Its topmatter becomes Block metadata instead of visible text, and its JavaScript fence becomes a stepped Code Beat.

---

id: greeting-function
title: Build a greeting

# Build a greeting

Read the function one step at a time, then change the name.

```js [1|2-4|5]
function greet(name) {
  const message = `Hello, ${name}!`;
  console.log(message);
}
greet("PathMX");
```

Expected output:

```text no-copy
Hello, PathMX!
```

Try it: change `"PathMX"` to your name and predict the output before running it.

---

## Controlling Code Beats

Code fences are included in the Player route by default. To display fences without making them Play stops, set `play.steps.code` to `none` in source frontmatter or Block topmatter:

```yaml
play:
  steps:
    code: none
```

Use this sparingly; instructional code usually benefits from being focusable.

---

## Writing code for learning

- Present one important idea per code example.
- Keep examples short enough to understand without excessive scrolling.
- Explain what learners should notice before the fence.
- Use line steps to reveal meaningful stages, not every individual line.
- Follow the example with a prediction, modification, or debugging task.
- Give immediate feedback through expected output, a test, a quiz, or an agent check.
- Use real, runnable code when teaching a programming language.
- Never place secrets, credentials, or destructive commands in copyable examples.

Preview code with `pathmx play`. Check the highlighting, copy control, and every authored line step before publishing.
