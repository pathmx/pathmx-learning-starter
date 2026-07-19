import {
  escapeHtmlAttribute,
  plugin,
  type HtmlTransformContext,
} from "@fellowhumans/pathmx/plugin"
import {
  learningApplyTurnAction,
  learningBeginTurnAction,
  learningFailTurnAction,
} from "./actions"
import { learningConfirmPathAction } from "./confirm-path-action"

function addProposalConfirmationForm(context: HtmlTransformContext) {
  if (
    context.source.id !== "new.path" ||
    context.block.data.type !== "path-proposal" ||
    context.block.data.status !== "proposed"
  ) {
    return
  }
  const target = escapeHtmlAttribute(context.block.id)
  context.document.appendHtml(
    [
      '<form method="post" action="/new.path"',
      ' data-pathmx-form="confirm"',
      ' data-pathmx-action="learning.confirmPath"',
      ' data-pathmx-action-scope="block"',
      ` data-pathmx-action-target="${target}"`,
      ' data-pathmx-search="ignore">',
      '<input type="hidden" name="__pathmx_action_scope" value="block">',
      `<input type="hidden" name="__pathmx_action_target" value="${target}">`,
      '<div class="pmx-action-form__submit">',
      '<button type="submit" name="action" value="confirm">Confirm Path</button>',
      "</div>",
      "</form>",
    ].join("\n"),
  )
}

export function createLearningPlugin() {
  return plugin("pathmx/learning-loop", () => ({
    actions: [
      learningBeginTurnAction,
      learningApplyTurnAction,
      learningFailTurnAction,
      learningConfirmPathAction,
    ],
    transformHtml: addProposalConfirmationForm,
    actionMappings: ({ source }) =>
      source.data.type === "path" || source.data.type === "lesson"
        ? [
            {
              type: "source" as const,
              localName: "coach-begin",
              action: "learning.beginTurn" as const,
            },
            {
              type: "source" as const,
              localName: "coach-apply",
              action: "learning.applyTurn" as const,
            },
            {
              type: "source" as const,
              localName: "coach-fail",
              action: "learning.failTurn" as const,
            },
          ]
        : [],
  }))()
}
