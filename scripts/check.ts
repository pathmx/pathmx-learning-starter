#!/usr/bin/env bun

import { mkdtemp, readFile, rm } from "node:fs/promises"
import os from "node:os"
import path from "node:path"

const root = path.resolve(import.meta.dir, "..")
const output = await mkdtemp(path.join(os.tmpdir(), "pathmx-learning-check-"))
const binary = path.join(root, "node_modules", ".bin", "pathmx")

async function checkLearningContract() {
  const config = await readFile(path.join(root, "pathmx.config.md"), "utf8")
  const configuredPaths = [...config.matchAll(/\]\((\.\/paths\/[^)]+\.md)\)/g)].map(
    (match) => match[1],
  )
  if (
    configuredPaths.length !== 1 ||
    configuredPaths[0] !== "./paths/index.path.md"
  ) {
    throw new Error(
      "Learning spaces keep paths/index.path.md as the single configured Player root; link learner Paths from home instead",
    )
  }

  const lessonFiles = await Array.fromAsync(
    new Bun.Glob("paths/**/modules/**/*.lesson.md").scan({ cwd: root, dot: true }),
  )
  const moduleDirectories = new Set(lessonFiles.map((file) => path.dirname(file)))
  for (const directory of moduleDirectories) {
    const moduleLessons = lessonFiles.filter((file) => path.dirname(file) === directory)
    if (moduleLessons.length < 2 || moduleLessons.length > 4) {
      throw new Error(`${directory} must contain 2–4 ready lesson Sources`)
    }
    const review = await Array.fromAsync(
      new Bun.Glob(`${directory}/*.practice.md`).scan({ cwd: root, dot: true }),
    )
    const checkpoint = await Array.fromAsync(
      new Bun.Glob(`${directory}/*.assessment.md`).scan({ cwd: root, dot: true }),
    )
    if (review.length === 0 || checkpoint.length === 0) {
      throw new Error(`${directory} needs focused review and a milestone checkpoint`)
    }
  }

  const supportChecks = [
    ["worked example", /worked example|example/i],
    ["optional hint", /hint/i],
    ["smaller attempt", /smaller|reduced attempt|reduced version/i],
    ["self-check or rationale", /self-check|rationale|rubric|success criteria/i],
    ["optional stretch", /stretch/i],
  ] as const
  for (const file of lessonFiles) {
    const content = await readFile(path.join(root, file), "utf8")
    if (/<!--\s*Author:/i.test(content)) {
      throw new Error(`${file} still contains module scaffold author notes`)
    }
    for (const [label, pattern] of supportChecks) {
      if (!pattern.test(content)) throw new Error(`${file} is missing ${label}`)
    }
  }
}

try {
  const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"))
  const baseline = packageJson.pathmxCompatibility?.baseline
  const installed = packageJson.dependencies?.["@fellowhumans/pathmx"]
  const candidate = Bun.argv.includes("--candidate")
  if (!/^\d+\.\d+\.\d+$/.test(baseline ?? "") || !/^\d+\.\d+\.\d+$/.test(installed ?? "")) {
    throw new Error("PathMX compatibility versions must be exact")
  }
  if (baseline !== installed && !candidate) {
    throw new Error(
      "PathMX dependency differs from the verified baseline; run check:candidate",
    )
  }

  await checkLearningContract()

  const child = Bun.spawn(
    [
      binary,
      "build",
      "paths/index.path.md",
      "paths/.fixtures/compatibility.path.md",
      "-o",
      output,
      "--clean",
    ],
    { cwd: root, stdout: "pipe", stderr: "pipe" },
  )

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ])
  const diagnostics = `${stdout}\n${stderr}`.trim()
  if (exitCode !== 0) throw new Error(diagnostics || `PathMX build failed (${exitCode})`)
  if (/\b(?:warning|error):/i.test(diagnostics)) {
    throw new Error(`PathMX reported diagnostics:\n${diagnostics}`)
  }

  const matches = Array.fromAsync(
    new Bun.Glob("**/.fixtures/compatibility.path.html").scan({
      cwd: output,
      dot: true,
    }),
  )
  const files = await matches
  if (files.length !== 1) {
    throw new Error(`Expected one compatibility artifact, found ${files.length}`)
  }

  const html = await readFile(path.join(output, files[0]), "utf8")
  for (const expected of [
    'data-pathmx-annotation-thread="c1"',
    'class="learning-reveal"',
  ]) {
    if (!html.includes(expected)) {
      throw new Error(`Compatibility fixture missing rendered evidence: ${expected}`)
    }
  }

  const graph = JSON.parse(
    await readFile(
      path.join(output, ".fixtures-compatibility.path", "graph-index.json"),
      "utf8",
    ),
  )
  const compatibility = graph.sources?.find(
    (source: { id?: string }) => source.id === ".fixtures/compatibility.path",
  )
  const question = compatibility?.blocks?.find(
    (block: { id?: string }) =>
      block.id === ".fixtures/compatibility.path#compatibility-choice",
  )
  if (question?.props?.actions?.submit !== "questions.submitSingleChoice") {
    throw new Error("Compatibility fixture missing question graph contract")
  }
  if (compatibility?.props?.annotations?.threads?.[0]?.id !== "c1") {
    throw new Error("Compatibility fixture missing annotation graph contract")
  }

  const versionNote = candidate
    ? `Candidate ${installed} passed against baseline ${baseline}.`
    : `Verified PathMX baseline ${baseline}.`
  process.stdout.write(`${diagnostics}\nCompatibility fixture passed.\n${versionNote}\n`)
} finally {
  await rm(output, { recursive: true, force: true })
}
