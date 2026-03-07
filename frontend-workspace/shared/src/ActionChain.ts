import type { IClearable, IDisposable } from "./types.ts"

export type ActionHandler<Arg> = (arg: Arg, stopSignal: () => void) => void
export type ActionChainChildKey = string | symbol

export class ActionChain<Arg> implements IDisposable, IClearable {
  private readonly _handlers: Array<{ handler: ActionHandler<Arg>; once?: boolean }> = []
  private readonly _childMap = new Map<ActionChainChildKey, ActionChain<Arg>>()

  child(key: ActionChainChildKey) {
    if (!this._childMap.has(key)) this._childMap.set(key, new ActionChain<Arg>())
    return this._childMap.get(key)!
  }

  disposeChild(key: ActionChainChildKey) {
    this._childMap.delete(key)
  }

  bind(handler: ActionHandler<Arg>, once?: boolean) {
    this._handlers.push({ handler, once })
    return this
  }

  invoke(arg: Arg) {
    let stop = false
    const stopSignal = () => (stop = true)
    const handlers = this._handlers.slice()
    for (let i = 0; i < handlers.length && !stop; i++) {
      handlers[i].handler(arg, stopSignal)
      if (handlers[i].once) {
        const index = this._handlers.indexOf(handlers[i])
        if (index >= 0) this._handlers.splice(index, 1)
      }
    }
    for (let [key, child] of this._childMap.entries().toArray()) {
      child.invoke(arg)
      if (!child._handlers.length) this._childMap.delete(key)
    }
    return this
  }

  dispose() {
    this.clear()
  }

  clear() {
    this._handlers.length = 0
    this._childMap.clear()
  }
}
