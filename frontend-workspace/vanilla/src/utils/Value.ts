import type { StopWatcher, Watcher } from "../types.ts"
import { ScopedWatcher } from "./ScopedWatcher.ts"

export class Value<T> {
  private readonly _watcher: Watcher[] = []

  constructor(private _val: T) {}

  get(): T {
    return this._val
  }

  set(val: T) {
    if (val !== this._val) {
      this._val = val
      for (let watcher of this._watcher) {
        watcher()
      }
    }
    return this
  }

  register(watcher: Watcher): StopWatcher {
    this._watcher.push(watcher)
    const stopWatcher: StopWatcher = () => {
      const index = this._watcher.indexOf(watcher)
      if (index >= 0) this._watcher.splice(index, 1)
    }
    ScopedWatcher.current().attach(stopWatcher)
    return stopWatcher
  }

  clear() {
    this._watcher.length = 0
  }
}
