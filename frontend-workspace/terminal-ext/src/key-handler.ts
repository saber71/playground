import { parseKey } from "./ansi-code"
import type { IInputSource } from "./capabilities.interface.ts"
import type { IKeyHandler, IKeySubscription, KeyListener } from "./key-handler.interface.ts"
import type { IDisposable } from "./types.ts"

export class KeyHandler implements IKeyHandler {
  private readonly _listeners: KeyListener[] = []
  private _isEnable = false
  private _stopListener?: IDisposable

  constructor(private readonly _inputSource: IInputSource) {
    this.enable()
  }

  onData(cb: KeyListener): IKeySubscription {
    const listeners = this._listeners
    listeners.push(cb)
    return {
      dispose() {
        const index = listeners.indexOf(cb)
        if (index >= 0) listeners.splice(index, 1)
      },
    }
  }

  dispose(): this {
    this._listeners.length = 0
    this._stopListener?.dispose()
    return this
  }

  enable(): this {
    if (!this._isEnable) {
      this._isEnable = true
      this._stopListener = this._inputSource.onData((seq) => {
        if (!this._listeners.length) return
        const key = parseKey(seq)
        for (let listener of this._listeners) {
          if (listener(key) === false) return
        }
      })
    }
    return this
  }

  disable(): this {
    this._isEnable = false
    this._stopListener?.dispose()
    this._stopListener = undefined
    return this
  }

  isEnabled(): boolean {
    return this._isEnable
  }
}
