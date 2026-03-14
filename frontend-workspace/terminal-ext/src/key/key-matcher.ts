import { ActionChain } from "@saber71/shared"
import { type IKey, parseKey } from "../ansi-code"
import type { IInputSource } from "../capabilities.interface.ts"
import type { IKeyMatcher } from "./key-matcher.interface.ts"

export class KeyMatcher implements IKeyMatcher {
  private readonly _id = Symbol()
  private readonly _anyPatternActionChain = new ActionChain<IKey>()
  private readonly _patternMap = new Map<string, ActionChain<IKey>>()
  private _isEnabled = false

  constructor(private readonly _inputSource: IInputSource<string>) {}

  isEnabled() {
    return this._isEnabled
  }

  enable() {
    if (!this._isEnabled) {
      this._isEnabled = true
      this._inputSource
        .onData()
        .child(this._id)
        .bind((seq) => {
          const key = parseKey(seq)
          this.match(key)
        })
    }
    return this
  }

  disable() {
    if (this._isEnabled) {
      this._isEnabled = false
      this._inputSource.onData().disposeChild(this._id)
    }
    return this
  }

  pattern(pattern: string | IKey): ActionChain<IKey> {
    if (pattern === "*") return this._anyPatternActionChain
    if (typeof pattern === "object") pattern = this._keyToString(pattern)
    if (!this._patternMap.has(pattern)) this._patternMap.set(pattern, new ActionChain())
    return this._patternMap.get(pattern)!
  }

  match(key: IKey): this {
    const pattern = this._keyToString(key)
    const actionChain = this._patternMap.get(pattern) ?? this._anyPatternActionChain
    actionChain.invoke(key)
    return this
  }

  dispose() {
    this.clear()
  }

  clear() {
    this._anyPatternActionChain.clear()
    this._patternMap.clear()
  }

  private _keyToString(key: IKey) {
    const arr = []
    if (key.shift) arr.push("shift")
    if (key.ctrl) arr.push("ctrl")
    if (key.alt) arr.push("alt")
    if (key.char) arr.push(key.char)
    return arr.join("+")
  }
}
