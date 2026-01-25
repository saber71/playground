import type { StopWatcher, Watcher } from "../types.ts"
import { ScopedWatcher } from "./ScopedWatcher.ts"
import { stopWatcher } from "./stopWatcher.ts"

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
    const scoped = ScopedWatcher.current()
    const fn = stopWatcher(() => {
      const index = this._watcher.indexOf(watcher)
      if (index >= 0) this._watcher.splice(index, 1)
    })
    scoped.attach(fn)
    return fn
  }

  clear() {
    this._watcher.length = 0
  }
}
