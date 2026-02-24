import { Emitter } from "./Emitter.ts"

export class EventEmitter<EventMap extends { [key: string | symbol]: any }> {
  private readonly _alias = new Map<any, any>()
  private readonly _emitters = new Map<any, Emitter<any>>()

  alias<EventName extends keyof EventMap>(
    eventName: EventName,
    aliasName: any,
  ): Emitter<EventMap[EventName]> {
    if (this._alias.has(aliasName)) throw new Error(`Alias name ${aliasName} already exists`)
    const emitter = this.event(eventName)
    this._alias.set(aliasName, emitter)
    return emitter
  }

  event<EventName extends keyof EventMap>(eventName: EventName): Emitter<EventMap[EventName]> {
    if (!this._emitters.has(eventName)) {
      this._emitters.set(eventName, new Emitter())
    }
    return this._emitters.get(eventName)!
  }

  clear() {
    this._alias.clear()
    this._emitters.clear()
    return this
  }
}
