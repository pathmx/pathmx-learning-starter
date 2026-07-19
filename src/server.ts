import {
  createPathMXServer,
  type CreatePathMXServerOptions,
} from "@fellowhumans/pathmx"
import { createPathMXPlayerPlugin } from "@fellowhumans/pathmx/player"
import { createLearningCoordinator } from "./learning/coordinator"
import { createCodexExecDriver } from "./learning/codex-exec-driver"
import { createFakeAgentDriver, type AgentDriver } from "./learning/drivers"
import { createLearningPlugin } from "./learning/plugin"

export async function createLearningServer(options: {
  cwd?: string
  port?: number
  outDir?: string
  watch?: boolean
  driver?: AgentDriver
} = {}) {
  const serverOptions: CreatePathMXServerOptions = {
    cwd: options.cwd ?? process.cwd(),
    mode: "development",
    host: "127.0.0.1",
    port: options.port ?? 3000,
    outDir: options.outDir ?? ".pathmx",
    pathEntries: ["paths/index.path.md"],
    watch: options.watch ?? true,
    buildPlugins: [
      createPathMXPlayerPlugin({ liveSocketPath: "/__pathmx/live" }),
      createLearningPlugin(),
    ],
    trustedActorModules: [
      createLearningCoordinator({
        driver: options.driver ?? createFakeAgentDriver(),
      }),
    ],
  }
  return createPathMXServer(serverOptions)
}

if (import.meta.main) {
  const driver = process.env.PATHMX_AGENT_DRIVER === "codex"
    ? createCodexExecDriver()
    : createFakeAgentDriver()
  const configuredPort = Number(process.env.PORT ?? 3000)
  if (!Number.isInteger(configuredPort) || configuredPort < 0 || configuredPort > 65_535) {
    throw new Error("PORT must be an integer from 0 through 65535.")
  }
  const server = await createLearningServer({ driver, port: configuredPort })
  await server.start()
  console.log(`${server.url}/index.path`)
}
