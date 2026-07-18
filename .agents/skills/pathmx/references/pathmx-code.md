# PathMX Code

Use normal fenced code. Add a language for highlighting.

````md
```js
const message = "Hello"
console.log(message)
```
````

## Focus steps

Add a step specification after the language:

````md
```js [1|2-3|4]
function greet(name) {
  const message = `Hello, ${name}`
  return message
}
```
````

- `|` starts the next step.
- `,` groups non-adjacent lines in one step.
- `N-M` selects an inclusive range.
- Line numbers start at one.

Plain fences are one Code Beat. A step specification creates ordered child
Beats. Invalid or out-of-range steps produce build diagnostics.

Live example:

```js [1|2-3|4]
function greet(name) {
  const message = `Hello, ${name}`
  return message
}

Use `no-copy` when copying would be harmful or confusing:

````md
```text no-copy
Example output only
```
````

Set `play.steps.code: none` in Source or Block data when fences should not
become Play stops.

## Review

- Keep one main idea per example.
- Explain what to notice before the fence.
- Step meaningful stages, not every line.
- Follow with a prediction, change, test, or debugging task.
- Keep secrets and destructive commands out of copyable examples.
- Build and inspect every code-step warning.
