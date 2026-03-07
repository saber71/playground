import { ActionChain } from "@saber71/shared"
import { type IKey, parseKey } from "../ansi-code"
import type { IInputSource } from "../capabilities.interface.ts"
import type { IKeyHandler } from "./key-handler.interface.ts"

export class KeyHandler implements IKeyHandler {
  private readonly _id = Symbol()
  private readonly _dataActionChain = new ActionChain<IKey>()
  private _isEnable = false

  constructor(private readonly _inputSource: IInputSource<string>) {
    this.enable()
  }

  onData() {
    return this._dataActionChain
  }

  dispose(): this {
    this.disable()
    this._dataActionChain.dispose()
    return this
  }

  enable(): this {
    if (!this._isEnable) {
      this._isEnable = true
      this._inputSource
        .onData()
        .child(this._id)
        .bind((seq) => {
          const key = parseKey(seq)
          this._dataActionChain.invoke(key)
        })
    }
    return this
  }

  disable(): this {
    this._isEnable = false
    this._inputSource.onData().disposeChild(this._id)
    return this
  }

  isEnabled(): boolean {
    return this._isEnable
  }
}
