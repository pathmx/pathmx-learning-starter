# PathMX Math

Math rendering depends on the project's enabled plugins. When available, use
LaTeX-style math inside ordinary Markdown.

```md
The area is $A = \pi r^2$.

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$
```

Use `$...$` for inline math and `$$...$$` for display math. Display math can
become its own Beat.

Keep notation readable:

- Introduce symbols in prose.
- Use braces for grouped exponents and subscripts.
- Explain why each transformation is valid.
- Split long derivations across Blocks when the learner's task changes.
- Give practice an answer, hint, test, or other feedback path.

Do not add a LaTeX document preamble or assume arbitrary LaTeX packages. Build
an example with the project's enabled math plugin before relying on a command.
