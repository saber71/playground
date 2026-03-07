import type { IClearable, IDisposable } from "./types.ts"

export type EmitterListener<Arg> = (arg: Arg) => void

export interface EmitterOnOption {
  once?: boolean
  key?: any
}

export class Emitter<Arg> implements IClearable, IDisposable {
  private readonly _listeners = new Map<any, EmitterListener<Arg>[]>()
  private readonly _onceListeners = new Map<any, EmitterListener<Arg>[]>()

  on(listener: EmitterListener<Arg>, option?: EmitterOnOption) {
    const map = option?.once ? this._onceListeners : this._listeners
    const key = option?.key ?? Symbol()
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(listener)
    return this
  }

  off(listener: EmitterListener<Arg>) {
    const maps = [this._listeners, this._onceListeners]
    for (let map of maps) {
      for (let [key, array] of map.entries()) {
        const index = array.indexOf(listener)
        if (index >= 0) {
          array.splice(index, 1)
          if (array.length === 0) map.delete(key)
        }
      }
    }
    return this
  }

  offByKey(key: any) {
    this._listeners.delete(key)
    this._onceListeners.delete(key)
    return this
  }

  emit(arg: Arg) {
    const maps = [this._listeners, this._onceListeners]
    for (let map of maps) {
      for (let [key, array] of map) {
        array.forEach((fn) => fn(arg))
      }
    }
    this._onceListeners.clear()
    return this
  }

  clear() {
    this._onceListeners.clear()
    this._listeners.clear()
    return
  }

  dispose() {
    this.clear()
  }
}
