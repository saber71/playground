import { Emitter } from "./Emitter.ts"
import type { IClearable, IDisposable } from "./types.ts"

export class EventEmitter<EventMap extends { [key: string | symbol]: any }>
  implements IClearable, IDisposable
{
  private readonly _alias = new Map<any, any[]>()
  private readonly _emitters = new Map<any, Emitter<any>>()

  alias<EventName extends keyof EventMap>(
    eventName: EventName,
    aliasName: any,
  ): Emitter<EventMap[EventName]> {
    if (!this._alias.has(eventName)) this._alias.set(eventName, [])
    this._alias.get(eventName)!.push(aliasName)
    return this.event(aliasName)
  }

  event<EventName extends keyof EventMap>(eventName: EventName): Emitter<EventMap[EventName]> {
    if (!this._emitters.has(eventName)) {
      this._emitters.set(eventName, new Emitter())
    }
    return this._emitters.get(eventName)!
  }

  emit<EventName extends keyof EventMap>(eventName: EventName, arg: EventMap[EventName]) {
    const _this = this
    emit(eventName)
    return this

    function emit(eventName: any) {
      _this.event(eventName).emit(arg)
      const alias = _this._alias.get(eventName)
      if (alias) {
        alias.forEach(emit)
      }
    }
  }

  removeEvent<EventName extends keyof EventMap>(eventName: EventName | string) {
    const _this = this
    remove(eventName)
    return this
    function remove(name: any) {
      _this._emitters.delete(name)
      const alias = _this._alias.get(name)
      if (alias) alias.forEach(remove)
    }
  }

  clear() {
    this._alias.clear()
    this._emitters.clear()
    return
  }

  dispose() {
    this.clear()
  }
}
