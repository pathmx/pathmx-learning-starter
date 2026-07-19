import { expect, it } from "bun:test"
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { createFakeAgentDriver } from "../src/learning/drivers"
import { pathDestinationsForTopic } from "../src/learning/path-instantiation"
import { createLearningServer } from "../src/server"

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((resolvePromise) => {
    resolve = resolvePromise
  })
  return { promise, resolve }
}

async function createProject() {
  const root = await mkdtemp(path.join(os.tmpdir(), "pathmx-learning-loop-"))
  await cp(path.join(import.meta.dir, "../paths"), path.join(root, "paths"), {
    recursive: true,
  })
  return {
    root,
    sourcePath: path.join(root, "paths/new.path.md"),
    readSource: () => readFile(path.join(root, "paths/new.path.md"), "utf8"),
    writeSource: (source: string) =>
      writeFile(path.join(root, "paths/new.path.md"), source),
    cleanup: () => rm(root, { recursive: true, force: true }),
  }
}

async function submitQuestion(options: {
  url: string
  invocationId: string
  blockId: string
  field: string
  value: string
}) {
  const response = await fetch(`${options.url}/new.path`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: new URLSearchParams({
      action: "submit",
      _pathmx_invocation: options.invocationId,
      __pathmx_action_scope: "block",
      __pathmx_action_target: `new.path#${options.blockId}`,
      [options.field]: options.value,
    }),
  })
  expect(response.status).toBe(200)
}

async function submitGoal(options: {
  url: string
  invocationId: string
  topic: string
  cookie?: string
}) {
  const body = new URLSearchParams({
    action: "submit",
    _pathmx_invocation: options.invocationId,
    __pathmx_action_scope: "block",
    __pathmx_action_target: "new.path#learning-goal",
    "question.learning-goal.topic": options.topic,
    "question.learning-goal.outcome": `Explain ${options.topic} with a useful example`,
    "question.learning-goal.starting-point": "I know a few words but no clear model",
    "question.learning-goal.time": "three twenty-minute sessions",
  })
  const response = await fetch(`${options.url}/new.path`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      ...(options.cookie ? { cookie: options.cookie } : {}),
    },
    body,
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
  const deadline = Date.now() + 5_000
  let source = await readSource()
  while (!predicate(source) && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 20))
    source = await readSource()
  }
  if (!predicate(source)) throw new Error(`Timed out waiting for ${label}.`)
  return source
}

async function waitForPage(
  url: string,
  predicate: (html: string) => boolean,
  label: string,
) {
  const deadline = Date.now() + 5_000
  let html = ""
  while (Date.now() < deadline) {
    const response = await fetch(url)
    html = await response.text()
    if (response.ok && predicate(html)) return html
    await Bun.sleep(20)
  }
  throw new Error(`Timed out waiting for ${label}.\n${html.slice(-1_000)}`)
}

async function submitConfirmation(options: {
  url: string
  invocationId: string
  proposalId: string
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
      action: "confirm",
      _pathmx_invocation: options.invocationId,
      __pathmx_action_scope: "block",
      __pathmx_action_target: `new.path#${options.proposalId}`,
    }),
  })
  const json = await response.json()
  if (response.status !== 200) {
    throw new Error(`Path confirmation failed (${response.status}): ${JSON.stringify(json)}`)
  }
  return json
}

it("runs the fake driver through HTTP, Actor, Action, Source, update, and reload", async () => {
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
      invocationId: "fake-goal-1",
      topic: "the greenhouse effect",
    })
    const pending = await waitForSource(
      project.readSource,
      (source) => source.includes("status: pending"),
      "the durable pending receipt",
    )
    expect(pending).toContain(`causeRun: ${submitted.json.actionRun.started.run.id}`)
    expect(pending).not.toContain("type: agent-response")

    driverGate.resolve()
    const completed = await waitForSource(
      project.readSource,
      (source) =>
        source.includes("status: complete") &&
        source.includes("A practical outcome for the greenhouse effect"),
      "the completed fake-driver turn",
    )
    expect(completed.match(/type: agent-response/g)).toHaveLength(2)

    const retry = await submitGoal({
      url: server.url,
      invocationId: "fake-goal-1",
      topic: "the greenhouse effect",
      cookie: submitted.cookie,
    })
    expect(retry.json.actionRun.started.run.id).toBe(
      submitted.json.actionRun.started.run.id,
    )
    await new Promise((resolve) => setTimeout(resolve, 100))
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
    expect(reloaded).toContain("A practical outcome for the greenhouse effect")
  } finally {
    driverGate.resolve()
    await server.stop()
    await project.cleanup()
  }
})

it("confirms a proposal into an atomic Path and immediately playable Lesson", async () => {
  const project = await createProject()
  const topic = "the greenhouse effect"
  const destination = pathDestinationsForTopic(topic)
  const pathSourcePath = path.join(project.root, "paths", destination.pathSourcePath)
  const lessonSourcePath = path.join(
    project.root,
    "paths",
    destination.lessonSourcePath,
  )
  let server = await createLearningServer({
    cwd: project.root,
    port: 0,
    outDir: ".pathmx-test",
    watch: false,
    driver: createFakeAgentDriver(),
  })

  try {
    await server.start()
    const submitted = await submitGoal({
      url: server.url,
      invocationId: "journey-goal-1",
      topic,
    })
    const proposed = await waitForSource(
      project.readSource,
      (source) =>
        source.includes("type: path-proposal") &&
        source.includes("status: proposed"),
      "the confirmable Path proposal",
    )
    const proposalId = proposed.match(
      /type: path-proposal\n(?:.|\n)*?id: ([^\n]+)/,
    )?.[1]
    expect(proposalId).toBeTruthy()
    await waitForPage(
      `${server.url}/new.path`,
      (html) =>
        html.includes('data-pathmx-action="learning.confirmPath"') &&
        html.includes(">Confirm Path</button>"),
      "the rendered confirmation Action",
    )
    await waitForPage(
      `${server.url}/graph-index.json`,
      (json) => json.includes("learning.confirmPath"),
      "the indexed confirmation Action",
    )
    const confirmation = await submitConfirmation({
      url: server.url,
      invocationId: "journey-confirm-1",
      proposalId: proposalId!,
      cookie: submitted.cookie,
    })
    expect(confirmation).toMatchObject({
      ok: true,
      actionRun: {
        started: { action: { action: "learning.confirmPath" } },
        finished: {
          outcome: {
            type: "finalized",
            result: {
              status: "created",
              pathSourceId: destination.pathSourceId,
              lessonSourceId: destination.lessonSourceId,
            },
          },
        },
      },
    })
    expect(
      confirmation.actionRun.finished.outcome.sourceChange.changedSources,
    ).toHaveLength(3)

    const [pathSource, lessonSource, onboarding] = await Promise.all([
      readFile(pathSourcePath, "utf8"),
      readFile(lessonSourcePath, "utf8"),
      project.readSource(),
    ])
    expect(pathSource).toContain("type: path\nstatus: active")
    expect(pathSource).toContain("./lessons/01-start/index.lesson.md")
    expect(pathSource).not.toContain("type: template")
    expect(lessonSource).toContain("type: lesson\nstatus: active")
    expect(lessonSource).toContain("type: question\nid: first-evidence")
    expect(lessonSource).not.toContain("type: template")
    expect(onboarding).toContain("status: confirmed")
    expect(onboarding).toContain("Your learning Path is ready")

    const lessonRoute =
      `/learner-paths/${destination.slug}/lessons/01-start/index.lesson`
    await waitForPage(
      `${server.url}${lessonRoute}`,
      (html) => html.includes("How would you explain"),
      "the immediately readable Lesson",
    )

    const retry = await submitConfirmation({
      url: server.url,
      invocationId: "journey-confirm-1",
      proposalId: proposalId!,
      cookie: submitted.cookie,
    })
    expect(retry.actionRun.started.run.id).toBe(
      confirmation.actionRun.started.run.id,
    )
    const onboardingBeforeNoop = await project.readSource()
    const distinctRetry = await submitConfirmation({
      url: server.url,
      invocationId: "journey-confirm-2",
      proposalId: proposalId!,
      cookie: submitted.cookie,
    })
    expect(distinctRetry).toMatchObject({
      ok: true,
      actionRun: {
        finished: {
          outcome: {
            type: "noop",
            result: {
              status: "existing",
              pathSourceId: destination.pathSourceId,
              lessonSourceId: destination.lessonSourceId,
            },
          },
        },
      },
    })
    await expect(project.readSource()).resolves.toBe(onboardingBeforeNoop)

    const lessonResponse = await fetch(`${server.url}${lessonRoute}`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        ...(submitted.cookie ? { cookie: submitted.cookie } : {}),
      },
      body: new URLSearchParams({
        action: "submit",
        _pathmx_invocation: "journey-lesson-1",
        __pathmx_action_scope: "block",
        __pathmx_action_target: `${destination.lessonSourceId}#first-evidence`,
        "question.first-evidence":
          "Heat is trapped by gases, but I am not sure what trapped means.",
      }),
    })
    expect(lessonResponse.status).toBe(200)
    const completedLesson = await waitForSource(
      () => readFile(lessonSourcePath, "utf8"),
      (source) =>
        source.includes("status: complete") &&
        source.includes("type: agent-response"),
      "the coach turn inside the created Lesson",
    )
    expect(completedLesson).toContain("response:\n  text:")

    await server.stop()
    server = await createLearningServer({
      cwd: project.root,
      port: 0,
      outDir: ".pathmx-test",
      watch: false,
      driver: createFakeAgentDriver(),
    })
    await server.start()
    const reloaded = await fetch(`${server.url}${lessonRoute}`).then((response) =>
      response.text(),
    )
    expect(reloaded).toContain("Coach prepared the next move")
  } finally {
    await server.stop()
    await project.cleanup()
  }
})

it("discards stale fake output and lets the latest learner Response win", async () => {
  const project = await createProject()
  const driverGate = deferred()
  const server = await createLearningServer({
    cwd: project.root,
    port: 0,
    outDir: ".pathmx-test",
    watch: false,
    driver: createFakeAgentDriver({ wait: driverGate.promise }),
  })

  try {
    await server.start()
    const first = await submitGoal({
      url: server.url,
      invocationId: "stale-goal-1",
      topic: "an outdated goal",
    })
    await waitForSource(
      project.readSource,
      (source) => source.includes("status: pending"),
      "the first pending receipt",
    )
    await submitGoal({
      url: server.url,
      invocationId: "stale-goal-2",
      topic: "photosynthesis",
      cookie: first.cookie,
    })
    driverGate.resolve()

    const settled = await waitForSource(
      project.readSource,
      (source) =>
        source.includes("status: failed") &&
        source.includes("A practical outcome for photosynthesis"),
      "the stale failure and latest completed turn",
    )
    expect(settled).toContain("The learner Response changed while Coach was working")
    expect(settled).not.toContain("A practical outcome for an outdated goal")
    expect(settled.match(/type: agent-response/g)).toHaveLength(2)
  } finally {
    driverGate.resolve()
    await server.stop()
    await project.cleanup()
  }
})

it("wakes the same generic loop for text and single-choice Questions", async () => {
  const scenarios = [
    {
      id: "text-goal",
      field: "question.text-goal",
      value: "Help me distinguish weather from climate",
      source: [
        "---",
        "type: path",
        "---",
        "",
        "# Text learning goal",
        "",
        "---",
        "",
        "<!--",
        "type: question",
        "id: text-goal",
        "question:",
        "  type: long",
        "actions:",
        "  submit: questions.submitText",
        "-->",
        "",
        "## What do you want to understand?",
        "",
        "[Coach](./coach.persona.md) · [Catalog](./library/component-catalog.guide.md)",
        "",
      ].join("\n"),
    },
    {
      id: "choice-goal",
      field: "question.choice-goal",
      value: "build-a-working-mental-model",
      source: [
        "---",
        "type: path",
        "---",
        "",
        "# Choice learning goal",
        "",
        "---",
        "",
        "<!--",
        "type: question",
        "id: choice-goal",
        "actions:",
        "  submit: questions.submitSingleChoice",
        "-->",
        "",
        "## What would help most?",
        "",
        "- Build a working mental model",
        "- Practice a concrete skill",
        "",
        "[Coach](./coach.persona.md) · [Catalog](./library/component-catalog.guide.md)",
        "",
      ].join("\n"),
    },
  ]

  for (const scenario of scenarios) {
    const project = await createProject()
    await project.writeSource(scenario.source)
    const server = await createLearningServer({
      cwd: project.root,
      port: 0,
      outDir: ".pathmx-test",
      watch: false,
      driver: createFakeAgentDriver(),
    })
    try {
      await server.start()
      await submitQuestion({
        url: server.url,
        invocationId: `${scenario.id}-1`,
        blockId: scenario.id,
        field: scenario.field,
        value: scenario.value,
      })
      const completed = await waitForSource(
        project.readSource,
        (source) => source.includes("status: complete"),
        `${scenario.id} completion`,
      )
      expect(completed).toContain("type: agent-response")
    } finally {
      await server.stop()
      await project.cleanup()
    }
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
      invocationId: "failed-goal-1",
      topic: "plate tectonics",
    })
    const failed = await waitForSource(
      project.readSource,
      (source) => source.includes("status: failed"),
      "the failed driver receipt",
    )
    expect(failed).toContain("provider unavailable")
    expect(failed).not.toContain("type: agent-response")
  } finally {
    await server.stop()
    await project.cleanup()
  }
})
