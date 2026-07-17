---
name: pathmx
description: Author rich interactive curriculum repositories using Paths Markdown eXtension
---

# PathMX

PathMX is a modern markdown-first framework for building learning-oriented websites.

What you can do with PathMX:

- Author rich, interactive learning sites entirely in markdown
- Build custom components and interactions
- Create personalized learning paths through linked content
- Ship production-ready sites that are portable, agent-friendly, and future-proof

PathMX is both a methodology and a development framework. The methodology can be used without special tooling on any operating system.

## Motivation

PathMX is meant to standardize the way learning content is authored and consumed by agents and humans.

PathMX is a curriculum-as-code methodology that is:

- **Human-readable** without extra tooling.
- **Parseable** by agents and tools.
- **Diffable** in normal version control.
- **Portable** across tools, organizations, and time.

The methodology is minimally opinionated. It standardizes only the small set of structural conventions needed to make a knowledge graph *self-describing*; anything beyond that is left to the producer.

## Terminology

| Term | Meaning |
| --- | --- |
| **Source** | One markdown file: frontmatter + content, parsed into Blocks. The unit of the knowledge graph. |
| **Block** | A thematic unit of content within a Source, delimited by `---`. The coarse Play unit — like a slide. |
| **Beat** | One focusable Play stop inside a Block: a paragraph, list item, table row, code step, media element, or component state. |
| **Frontmatter** | YAML metadata at the top of a Source (`type`, `title`, `tags`, `theme`, `play`, …). |
| **Topmatter** | Block-level metadata written as an HTML comment immediately after a `---` divider. Overrides frontmatter for that Block. |
| **Type hint** | The filename suffix that declares a Source's role and build type, e.g. `intro.lesson.md`, `week-1.lab.md`. |
| **Root Source** | An entry point to the repository (conventionally `paths/index.path.md`). Everything reachable from a root forms one graph/view. |
| **Play** | The guided mode of the player: focused, step-by-step traversal of Blocks and Beats. Contrast with **browse** (free scroll). |
| **Directive** | An `@`-prefixed marker on a markdown link or reference definition (`[@include: …]`, `[@styles]:`) that gives it PathMX behavior. |
| **Literate component** | A reusable custom tag defined in a `*.component(s).md` file as prose + `html`/`css`/`js` fences. |

## Methodology

There are three core principles to the PathMX methodology:

## Principle 1: Markdown-first

Markdown is the lingua franca of modern human and agent interactions. It is a well-established, stable and portable format for authoring human-and-agent readable plain text documents with hyperlink support. PathMX-compatible markdown should support CommonMark and GFM flavoured markdown as well as more advanced PathMX-specific examples. In general PathMX markdown should be written to be human-readable and agent friendly.

See the [PathMX Markdown Guide](./references/pathmx-markdown.md) for more information on how to write proper PathMX markdown.

## Principle 2: Explicit file types

Type hints allow you to indicate the role of a file in the name of the file. This pattern allows agents and humans to quickly intuit the purpose of a file without having to read the contents. This is especially important in modern agentic harnesses since agents naturally look at file paths to search for relevant patterns and context. PathMX files are type-hinted with an extension prefix e.g. `lesson-1.slides.md` or `week-1.lab.md` etc.

See the [Simple PathMX Repo Example](./references/repo-example/pathmx-repository.md#file-types) for an example of a PathMX repository with type hints and an ontology map file.

## Principle 3: Hyperlinked paths

Links between documents create a natural knowledge graph and allow for creating paths through it. A large knowledge graph may have many different paths depending on where the user is coming from or entering the space. PathMX repositories are organized by root entry points that create a graph-per-root for each link that is reachable from the root. This allows for multiple "views" of the same learning graph and serves as a natural permissions layer for who can see what. Most PathMX repos start with a single root, conventionally located in `paths/index.path.md`.

See the [Simple PathMX Repo Example](./references/repo-example) for an example PathMX repository. Note that the desired structure and setup will depend on the use case and domain PathMX is being used to model.

---

# PathMX framework

The PathMX development framework handles building/bundling PathMX markdown source repositories into "playable" interactive web-based curriculum. The primary tool that handles the building/server is the `pathmx` cli tool. The PathMX CLI will create a local live server that watches the repository and incrementally builds and sends live updates to attached client players. 

# Setup and Installation

Make sure the user has the latest `bun` runtime installed on their system as pathmx currently relies on bun to run.

## 1. Install Or Update PathMX

If `pathmx` is not installed:

```sh
bun add -g @fellowhumans/pathmx@latest
```

If it is installed, update it through the supported CLI path:

```sh
pathmx self-update
```

Then record the exact version and inspect the current init help:

```sh
pathmx --version
pathmx init --help
```

---

# PathMX Authoring

PathMX should be written as simple, human-readable CommonMark/GFM markdown by default, with extensions used where appropriate to the learning experience.

## Built in PathMX Capabilities

The most important difference between PathMX and other markdown-based content authoring tools is that its primary use is to be "played" in a focused, direct learning sequence.

Understanding how PathMX content should be structured from an LX (learner eXperience) perspective is essential to authoring great PathMX experiences.

## Reference Docs

Read the reference that matches the surface you are working on:

- [PathMX Markdown](./references/pathmx-markdown.md) — core writing guide: Sources, Blocks, Beats, topmatter, and the extension catalog. Start here.
- [PathMX Player](./references/pathmx-player.md) — the guided player UX: focus levels, navigation, pacing, and authoring for Play.
- [Literate Components](./references/pathmx-literate-components.md) — defining and using custom tags, component state, and scripts.
- [Directives](./references/pathmx-directives.md) — `@include` transclusion, imports, and resources.
- [Questions & Responses](./references/pathmx-questions.md) — question blocks, tasks, and durable learner responses.
- [Math](./references/pathmx-math.md) — inline/display LaTeX math.
- [Code](./references/pathmx-code.md) — highlighting, fence flags, and code focus steps.
- [Media](./references/pathmx-media.md) — images, image directives, generated images, and icons.
- [Styling](./references/pathmx-styling.md) — style imports, theme tokens, fonts, and color modes.
- [Config](./references/pathmx-config.md) — roots, plugins, and repository configuration.
- [Tooling & Verification](./references/pathmx-tooling.md) — CLI usage and verifying that authored content builds and plays.
- [Repo Example](./references/pathmx-repo-example/pathmx-repository.md) — an example repository layout with type hints.

