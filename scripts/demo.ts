import { cp, mkdtemp, rm } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { createCodexExecDriver } from "../src/learning/codex-exec-driver"
import { createFakeAgentDriver } from "../src/learning/drivers"
import { createLearningServer } from "../src/server"

const project = await mkdtemp(path.join(os.tmpdir(), "pathmx-learning-demo-"))
await cp(path.join(import.meta.dir, "../paths"), path.join(project, "paths"), {
  recursive: true,
})

const port = Number(process.env.PORT ?? 3230)
if (!Number.isInteger(port) || port < 0 || port > 65_535) {
  throw new Error("PORT must be an integer from 0 through 65535.")
}
const driver = process.env.PATHMX_AGENT_DRIVER === "codex"
  ? createCodexExecDriver({ timeoutMs: 60_000 })
  : createFakeAgentDriver()
const server = await createLearningServer({
  cwd: project,
  port,
  outDir: ".pathmx-demo",
  watch: false,
  driver,
})

let closing: Promise<void> | undefined
function close() {
  closing ??= (async () => {
    await server.stop()
    await rm(project, { recursive: true, force: true })
  })()
  return closing
}

process.once("SIGINT", () => void close().finally(() => process.exit(0)))
process.once("SIGTERM", () => void close().finally(() => process.exit(0)))

try {
  await server.start()
  console.log(`Disposable learning demo: ${server.url}/new.path`)
  console.log(`Temporary learner Sources: ${project}/paths`)
  console.log("Stop with Ctrl-C; the temporary Sources will be removed.")
} catch (error) {
  await close()
  throw error
}
