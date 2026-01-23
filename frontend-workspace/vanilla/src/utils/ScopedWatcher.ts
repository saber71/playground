import type { StopWatcher } from "../types.ts"

export class ScopedWatcher {
  private readonly _stopWatchers: StopWatcher[] = []

  private static readonly _defaultCurrent = new ScopedWatcher()
  private static _current: ScopedWatcher | null = null

  static current(cur?: ScopedWatcher | null) {
    if (cur === null) this._current = cur
    return this._current || this._defaultCurrent
  }

  attach(stopWatcher: StopWatcher) {
    this._stopWatchers.push(stopWatcher)
  }

  destroy() {
    for (let stopWatcher of this._stopWatchers) {
      stopWatcher()
    }
    this._stopWatchers.length = 0
  }
}
