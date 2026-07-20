import { expect, it } from "bun:test"
import { cp, mkdtemp, readFile, rm } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import {
  createFakeAgentDriver,
  type AgentDriver,
} from "../src/learning/drivers"
import { createLearningServer } from "../src/server"

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((resolvePromise) => {
    resolve = resolvePromise
  })
  return { promise, resolve }
}

async function createProject() {
  const root = await mkdtemp(path.join(os.tmpdir(), "pathmx-onboarding-"))
  await cp(path.join(import.meta.dir, "../paths"), path.join(root, "paths"), {
    recursive: true,
  })
  const sourcePath = path.join(root, "paths/new.path.md")
  return {
    root,
    readSource: () => readFile(sourcePath, "utf8"),
    cleanup: () => rm(root, { recursive: true, force: true }),
  }
}

async function submitGoal(options: {
  url: string
  invocationId: string
  topic: string
  cookie?: string
}) {
  const response = await fetch(`${options.url}/new.path`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      ...(options.cookie ? { cookie: options.cookie } : {}),
    },
    body: new URLSearchParams({
      action: "submit",
      _pathmx_invocation: options.invocationId,
      __pathmx_action_scope: "block",
      __pathmx_action_target: "new.path#learning-goal",
      "question.learning-goal.topic": options.topic,
      "question.learning-goal.outcome": `Explain ${options.topic} with a useful example`,
      "question.learning-goal.starting-point":
        "I know a few words but do not have a clear model",
      "question.learning-goal.time": "three twenty-minute sessions",
    }),
  })
  const json = await response.json()
  expect(response.status).toBe(200)
  expect(json).toMatchObject({
    ok: true,
    actionRun: {
      started: { action: { action: "questions.submitFields" } },
      finished: { outcome: { type: "finalized" } },
    },
  })
  return {
    json,
    cookie: response.headers.get("set-cookie")?.split(";", 1)[0],
  }
}

async function waitForSource(
  readSource: () => Promise<string>,
  predicate: (source: string) => boolean,
  label: string,
) {
  const deadline = Date.now() + 6_000
  let source = await readSource()
  while (!predicate(source) && Date.now() < deadline) {
    await Bun.sleep(20)
    source = await readSource()
  }
  if (!predicate(source)) throw new Error(`Timed out waiting for ${label}.`)
  return source
}

it("runs fake onboarding through HTTP, Actor, Actions, Source, and reload", async () => {
  const project = await createProject()
  const driverGate = deferred()
  let server = await createLearningServer({
    cwd: project.root,
    port: 0,
    outDir: ".pathmx-test",
    watch: false,
    driver: createFakeAgentDriver({ wait: driverGate.promise }),
  })

  try {
    await server.start()
    const submitted = await submitGoal({
      url: server.url,
      invocationId: "fake-onboarding-1",
      topic: "the greenhouse effect",
    })
    const causeRunId = submitted.json.actionRun.started.run.id
    const pending = await waitForSource(
      project.readSource,
      (source) => source.includes("status: pending"),
      "the durable pending receipt",
    )
    expect(pending).toContain(`causeRun: ${causeRunId}`)
    expect(pending).not.toContain("type: agent-response")
    expect(pending).toContain("Building your starting path…")
    expect(pending).not.toContain("receipt remains")

    driverGate.resolve()
    const completed = await waitForSource(
      project.readSource,
      (source) =>
        source.includes("status: complete") &&
        source.includes("Your starting path"),
      "the completed onboarding proposal",
    )
    expect(completed).toContain("the greenhouse effect")
    expect(completed).toContain(
      "Explain the greenhouse effect with a useful example",
    )
    expect(completed).toContain(
      "I know a few words but do not have a clear model",
    )
    expect(completed).toContain("three twenty-minute sessions")
    expect(completed).not.toContain("type: agent-response")
    expect(completed).not.toContain("Coach prepared the next move")
    expect(completed).not.toContain("type: path-proposal")

    const retry = await submitGoal({
      url: server.url,
      invocationId: "fake-onboarding-1",
      topic: "the greenhouse effect",
      cookie: submitted.cookie,
    })
    expect(retry.json.actionRun.started.run.id).toBe(causeRunId)
    await Bun.sleep(100)
    await expect(project.readSource()).resolves.toBe(completed)

    await server.stop()
    server = await createLearningServer({
      cwd: project.root,
      port: 0,
      outDir: ".pathmx-test",
      watch: false,
      driver: createFakeAgentDriver(),
    })
    await server.start()
    const reloaded = await fetch(`${server.url}/new.path`).then((response) =>
      response.text(),
    )
    expect(reloaded).toContain("Your starting path")
  } finally {
    driverGate.resolve()
    await server.stop()
    await project.cleanup()
  }
})

it("discards stale output and lets the latest onboarding Response win", async () => {
  const project = await createProject()
  const firstTurnGate = deferred()
  let callCount = 0
  const driver: AgentDriver = {
    async propose() {
      callCount += 1
      if (callCount === 1) await firstTurnGate.promise
      const current = callCount === 1 ? "stale" : "latest"
      return {
        type: "learning-turn",
        blocks: [
          {
            id: `${current}-proposal`,
            title: `${current} proposal`,
            markdown: `This is the ${current} proposal.`,
          },
        ],
      }
    },
  }
  const server = await createLearningServer({
    cwd: project.root,
    port: 0,
    outDir: ".pathmx-test",
    watch: false,
    driver,
  })

  try {
    await server.start()
    const first = await submitGoal({
      url: server.url,
      invocationId: "stale-onboarding-1",
      topic: "an outdated goal",
    })
    await waitForSource(
      project.readSource,
      (source) => source.includes("status: pending"),
      "the first pending receipt",
    )
    await submitGoal({
      url: server.url,
      invocationId: "stale-onboarding-2",
      topic: "photosynthesis",
      cookie: first.cookie,
    })
    firstTurnGate.resolve()

    const settled = await waitForSource(
      project.readSource,
      (source) =>
        source.includes("status: failed") && source.includes("latest proposal"),
      "the stale failure and latest proposal",
    )
    expect(settled).toContain(
      "The learner Response changed while Coach was working",
    )
    expect(settled).not.toContain("stale proposal")
    expect(callCount).toBe(2)
  } finally {
    firstTurnGate.resolve()
    await server.stop()
    await project.cleanup()
  }
})

it("records a driver failure on the same durable receipt", async () => {
  const project = await createProject()
  const server = await createLearningServer({
    cwd: project.root,
    port: 0,
    outDir: ".pathmx-test",
    watch: false,
    driver: {
      async propose() {
        throw new Error("provider unavailable")
      },
    },
  })
  try {
    await server.start()
    await submitGoal({
      url: server.url,
      invocationId: "failed-onboarding-1",
      topic: "plate tectonics",
    })
    const failed = await waitForSource(
      project.readSource,
      (source) => source.includes("status: failed"),
      "the failed driver receipt",
    )
    expect(failed).toContain("provider unavailable")
    expect(failed).toContain("We could not build the path yet")
    expect(failed).toContain("Your goal is saved. Try again when you are ready.")
    expect(failed).not.toContain("type: agent-response")
  } finally {
    await server.stop()
    await project.cleanup()
  }
})
