import type { StopWatcher } from "../types.ts"

export function stopWatcher(fn: () => void): StopWatcher {
  let runed = false
  return () => {
    if (runed) return
    runed = true
    fn()
  }
}
