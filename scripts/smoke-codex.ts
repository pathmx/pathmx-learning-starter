import { cp, mkdtemp, readFile, rm } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { createCodexExecDriver } from "../src/learning/codex-exec-driver"
import { pathDestinationsForTopic } from "../src/learning/path-instantiation"
import { createLearningServer } from "../src/server"

const project = await mkdtemp(path.join(os.tmpdir(), "pathmx-codex-smoke-"))
const sourcePath = path.join(project, "paths/new.path.md")
await cp(path.join(import.meta.dir, "../paths"), path.join(project, "paths"), {
  recursive: true,
})

const server = await createLearningServer({
  cwd: project,
  port: 0,
  outDir: ".pathmx-smoke",
  watch: false,
  driver: createCodexExecDriver({ timeoutMs: 60_000 }),
})

try {
  await server.start()
  const topic = "why seasons change"
  const destination = pathDestinationsForTopic(topic)
  const body = new URLSearchParams({
    action: "submit",
    _pathmx_invocation: "codex-live-smoke-1",
    __pathmx_action_scope: "block",
    __pathmx_action_target: "new.path#learning-goal",
    "question.learning-goal.topic": topic,
    "question.learning-goal.outcome":
      "Explain the seasons without confusing them with distance from the sun",
    "question.learning-goal.starting-point":
      "I know Earth has an orbit and a tilted axis",
    "question.learning-goal.time": "one fifteen-minute session",
  })
  const response = await fetch(`${server.url}/new.path`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body,
  })
  if (!response.ok) throw new Error(`Learner Action failed: ${response.status}`)
  const cookie = response.headers.get("set-cookie")?.split(";", 1)[0]

  const deadline = Date.now() + 70_000
  let source = await readFile(sourcePath, "utf8")
  while (
    !/status: (?:complete|failed)/.test(source) &&
    Date.now() < deadline
  ) {
    await Bun.sleep(100)
    source = await readFile(sourcePath, "utf8")
  }
  if (source.includes("status: failed")) {
    throw new Error(`Codex turn failed.\n${source.slice(-2_000)}`)
  }
  if (!source.includes("status: complete") || !source.includes("type: agent-response")) {
    throw new Error("Timed out waiting for a completed Codex learning turn.")
  }
  const onboardingTitles = [
    ...source.matchAll(/type: agent-response[\s\S]*?\n-->\n\n## (.+)$/gm),
  ].map((match) => match[1])

  const confirmation = await fetch(`${server.url}/new.path`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      ...(cookie ? { cookie } : {}),
    },
    body: new URLSearchParams({
      action: "confirm",
      _pathmx_invocation: "codex-live-confirm-1",
      __pathmx_action_scope: "block",
      __pathmx_action_target: "new.path#path-proposal",
    }),
  })
  if (!confirmation.ok) {
    throw new Error(
      `Path confirmation failed (${confirmation.status}): ${await confirmation.text()}`,
    )
  }

  const lessonPath = path.join(project, "paths", destination.lessonSourcePath)
  const lessonRoute =
    `/learner-paths/${destination.slug}/lessons/01-start/index.lesson`
  const lessonPage = await fetch(`${server.url}${lessonRoute}`)
  if (!lessonPage.ok) {
    throw new Error(`Created Lesson was not immediately routable: ${lessonPage.status}`)
  }
  const graphDeadline = Date.now() + 10_000
  let graphIndex = ""
  while (Date.now() < graphDeadline) {
    graphIndex = await fetch(`${server.url}/graph-index.json`).then((result) =>
      result.text(),
    )
    if (graphIndex.includes(`\"id\":\"${destination.lessonSourceId}\"`)) break
    await Bun.sleep(50)
  }
  if (!graphIndex.includes(`\"id\":\"${destination.lessonSourceId}\"`)) {
    throw new Error("Created Lesson did not enter the Action routing graph.")
  }
  const lessonSubmission = await fetch(`${server.url}${lessonRoute}`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      ...(cookie ? { cookie } : {}),
    },
    body: new URLSearchParams({
      action: "submit",
      _pathmx_invocation: "codex-live-lesson-1",
      __pathmx_action_scope: "block",
      __pathmx_action_target: `${destination.lessonSourceId}#first-evidence`,
      "question.first-evidence":
        "Seasons come from Earth orbiting the Sun, but I am unsure why the hemispheres differ.",
    }),
  })
  if (!lessonSubmission.ok) {
    throw new Error(
      `Lesson Action failed (${lessonSubmission.status}): ${await lessonSubmission.text()}`,
    )
  }

  const lessonDeadline = Date.now() + 70_000
  let lesson = await readFile(lessonPath, "utf8")
  while (
    !/status: (?:complete|failed)/.test(lesson) &&
    Date.now() < lessonDeadline
  ) {
    await Bun.sleep(100)
    lesson = await readFile(lessonPath, "utf8")
  }
  if (lesson.includes("status: failed")) {
    throw new Error(`Codex Lesson turn failed.\n${lesson.slice(-2_000)}`)
  }
  if (!lesson.includes("status: complete") || !lesson.includes("type: agent-response")) {
    throw new Error("Timed out waiting for the Codex turn inside the Lesson.")
  }
  const lessonTitles = [
    ...lesson.matchAll(/type: agent-response[\s\S]*?\n-->\n\n## (.+)$/gm),
  ].map((match) => match[1])
  console.log(
    `Codex journey passed: ${onboardingTitles.length} onboarding Blocks, atomic Path + Lesson creation, and ${lessonTitles.length} Lesson Blocks.`,
  )
  for (const title of lessonTitles) console.log(`- ${title}`)
} finally {
  await server.stop()
  await rm(project, { recursive: true, force: true })
}
