import { plugin } from "@fellowhumans/pathmx/plugin"
import {
  learningApplyTurnAction,
  learningBeginTurnAction,
  learningFailTurnAction,
} from "./actions"

export function createLearningPlugin() {
  return plugin("pathmx/learning-loop", () => ({
    actions: [
      learningBeginTurnAction,
      learningApplyTurnAction,
      learningFailTurnAction,
    ],
  }))()
}
