# PathMX Math

PathMX renders LaTeX-style math directly inside CommonMark/GFM Markdown. Write the expression between math delimiters; do not add a LaTeX preamble, `\documentclass`, or `\begin{document}`.

## Quick reference

| Write in PathMX Markdown | Use for |
| --- | --- |
| `$x + y$` | Inline math within a sentence |
| `$$`<br>`x + y`<br>`$$` | Display math on its own line |
| `^` and `_` | Exponents and subscripts |
| `{...}` | Grouping multiple characters |
| `\command` | A LaTeX symbol or operation |

## Inline math

Use one dollar sign on each side for a short expression that belongs in a sentence:

```md
The area of a circle is $A = \pi r^2$.
```

Rendered result: The area of a circle is $A = \pi r^2$.

The expression renders inline with the surrounding text. Do not add spaces immediately inside the delimiters: prefer `$x + y$` to `$ x + y $`.

## Display math

Use two dollar signs on each side when an equation should appear on its own line. Put both delimiters on separate lines:

```md
The first $n$ positive integers have the sum

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}.
$$
```

Rendered result:

The first $n$ positive integers have the sum

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}.
$$

Use display math for important equations, long expressions, and derivations. The fences in this guide show source examples only. In actual PathMX content, write the delimiters directly in the Markdown without the `` ```md `` fence.

## LaTeX syntax

LaTeX commands begin with a backslash. Commands usually apply to the next symbol or to a group inside braces `{...}`.

| PathMX Markdown | Meaning |
| --- | --- |
| `$x^2$` | Exponent |
| `$x_i$` | Subscript |
| `$x^{n+1}$` | Grouped exponent |
| `$a_{i+1}$` | Grouped subscript |
| `$\frac{a+b}{c}$` | Fraction |
| `$\sqrt{x}$` | Square root |
| `$\sqrt[3]{x}$` | Cube root |
| `$\alpha + \beta$` | Greek letters |
| `$\mathbb{R}$` | Number set |
| `$\left(\frac{x}{y}\right)$` | Automatically sized delimiters |

Use braces whenever an exponent, subscript, numerator, denominator, or command argument contains more than one character. For example, write `$x^{10}$`, not `$x^10$`.

## Common examples

```md
Arithmetic: $a + b - c \times d \div e$

Comparison: $x \ne 0$, $a \le b$, and $b \ge c$

Functions: $f(x) = x^2$ and $\sin(\theta) = \frac{1}{2}$

Calculus: $\lim_{x \to 0} f(x)$ and $\int_a^b f(x)\,dx$

Sets: $A \subseteq B$, $A \cup B$, and $x \in \mathbb{R}$

Logic: $p \land q$, $p \lor q$, and $p \Rightarrow q$
```

## Multi-line equations

Use an `aligned` environment inside display math. Place `&` before the alignment point and end each line with `\\`:

```md
$$
\begin{aligned}
(x+1)^2 &= (x+1)(x+1) \\
        &= x^2 + 2x + 1
\end{aligned}
$$
```

Add prose before or after the display to explain why each transformation is valid. Math formatting should support the lesson, not replace its explanation.

## Text and currency

Use `\text{...}` for words that must appear inside an equation:

```md
$$
d = rt \quad \text{where } r \text{ is the rate.}
$$
```

Because `$` starts inline math, escape a literal dollar sign in prose with a backslash: `\$25`.

Keep ordinary words outside math delimiters when possible. Use `\text{...}` only when words are part of the expression.

## Short proof example

The following PathMX Markdown proves that the square of an odd integer is odd:

```md
### Claim

If $n$ is odd, then $n^2$ is odd.

### Proof

Because $n$ is odd, there is an integer $k$ such that $n = 2k + 1$. Therefore,

$$
\begin{aligned}
n^2 &= (2k+1)^2 \\
    &= 4k^2 + 4k + 1 \\
    &= 2(2k^2+2k) + 1.
\end{aligned}
$$

Since $2k^2+2k$ is an integer, $n^2$ has the form $2m+1$. Therefore, $n^2$ is odd. $\square$
```

Rendered result:

### Claim

If $n$ is odd, then $n^2$ is odd.

### Proof

Because $n$ is odd, there is an integer $k$ such that $n = 2k + 1$. Therefore,

$$
\begin{aligned}
n^2 &= (2k+1)^2 \\
    &= 4k^2 + 4k + 1 \\
    &= 2(2k^2+2k) + 1.
\end{aligned}
$$

Since $2k^2+2k$ is an integer, $n^2$ has the form $2m+1$. Therefore, $n^2$ is odd. $\square$

This example introduces the definition in prose, aligns each algebraic step, and explains why the final expression proves the claim.

## Writing math for learning

PathMX content is played as a focused learning sequence. Math should remain readable in the Markdown source and should not overload a single block or beat.

- Introduce notation in words before using it extensively.
- Teach one new mathematical idea at a time.
- Show a worked example, then give the learner a similar problem to solve.
- Explain why each step is valid; do not use equations as a substitute for instruction.
- Give practice an immediate feedback method, such as an answer, hint, quiz, or agent check.
- Use a `---` thematic break when a long explanation should become a new PathMX block.
- Prefer reusable notation and consistent variable names across lessons and reference documents.

## Best practices

- Keep short expressions inline and put long or important equations in display blocks.
- Put display delimiters on their own lines with blank lines around the block.
- Use standard semantic commands such as `\frac`, `\sqrt`, `\sum`, and `\int`.
- Use braces to make grouping explicit and keep the Markdown source readable.
- Break a derivation into explained steps instead of writing one dense expression.
- Preview unfamiliar commands with `pathmx dev` or `pathmx play`.

PathMX supports the standard math notation used in its official demos through its built-in math plugin. It does not run a complete LaTeX document toolchain, so document commands and arbitrary LaTeX packages should not be used.
