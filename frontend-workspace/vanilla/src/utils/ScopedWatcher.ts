import type { StopWatcher } from "../types.ts"

export class ScopedWatcher {
  private static readonly _defaultCurrent = new ScopedWatcher()
  private static _current: ScopedWatcher | null = null
  private readonly _stopWatchers: StopWatcher[] = []

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

  beCurrent() {
    ScopedWatcher.current(this)
    return this
  }
}
