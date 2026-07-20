import { cp, mkdtemp, readFile, rm } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { createCodexExecDriver } from "../src/learning/codex-exec-driver"
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
  const response = await fetch(`${server.url}/new.path`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: new URLSearchParams({
      action: "submit",
      _pathmx_invocation: "codex-onboarding-smoke-1",
      __pathmx_action_scope: "block",
      __pathmx_action_target: "new.path#learning-goal",
      "question.learning-goal.topic": "why seasons change",
      "question.learning-goal.outcome":
        "Explain the seasons without confusing them with distance from the sun",
      "question.learning-goal.starting-point":
        "I know Earth has an orbit and a tilted axis",
      "question.learning-goal.time": "one fifteen-minute session",
    }),
  })
  if (!response.ok) throw new Error(`Learner Action failed: ${response.status}`)

  const deadline = Date.now() + 70_000
  let source = await readFile(sourcePath, "utf8")
  while (!/status: (?:complete|failed)/.test(source) && Date.now() < deadline) {
    await Bun.sleep(100)
    source = await readFile(sourcePath, "utf8")
  }
  if (source.includes("status: failed")) {
    throw new Error(`Codex onboarding failed.\n${source.slice(-2_000)}`)
  }
  if (
    !source.includes("status: complete") ||
    !source.includes("type: agent-response")
  ) {
    throw new Error("Timed out waiting for a completed Codex onboarding turn.")
  }

  const titles = [
    ...source.matchAll(/type: agent-response[\s\S]*?\n-->\n\n## (.+)$/gm),
  ].map((match) => match[1])
  console.log(`Codex onboarding passed with ${titles.length} proposal Blocks.`)
  for (const title of titles) console.log(`- ${title}`)
} finally {
  await server.stop()
  await rm(project, { recursive: true, force: true })
}
