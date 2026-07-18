# PathMX Media

Prefer standard Markdown and HTML. Keep repository-owned media local and use
relative paths.

## Images

```md
![A diagram showing data moving from Source to Player](./assets/flow.svg)
```

Use useful alt text. PathMX tracks local image files as build inputs.

Use semantic HTML when a caption or native controls matter:

```html
<figure>
  <img src="./assets/flow.svg" alt="Data moves from Source to Player">
  <figcaption>PathMX keeps the Markdown Source as the authored record.</figcaption>
</figure>
```

```html
<video controls preload="metadata" src="./assets/example.mp4">
  A text description of the video.
</video>
```

The optional image plugin may provide presentation directives such as
`@image.cover`, `@image.wide`, and `@image.background`. Confirm the plugin and
syntax in the installed version before using them.

## Review

- Use media only when it helps understanding or practice.
- Tell the learner what to notice.
- Provide alt text, captions, or transcripts.
- Avoid autoplay.
- Compress large files and use common browser formats.
- Keep important meaning in the surrounding Markdown.
