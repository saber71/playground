import wcwidth from "wcwidth"
import { AnsiKey } from "../ansi-code"
import type { ITerminalStyle } from "../capabilities.interface.ts"
import type { IKeyHandler, IKeySubscription } from "../key-handler.interface.ts"
import type { ITextChar } from "../text"
import type { InputMode, IScreenBufferEditor } from "./buffer-editor.interface.ts"
import type { IScreenBufferWriter } from "./buffer-writer.interface.ts"
import type { IScreenBuffer } from "./buffer.interface.ts"

export class ScreenBufferEditor implements IScreenBufferEditor {
  private _cursorPos = 0
  private _inputMode: InputMode = "normal"
  private readonly _chars: ITextChar[] = []
  private readonly _keySubscription: IKeySubscription

  constructor(
    readonly writer: IScreenBufferWriter,
    readonly keyHandler: IKeyHandler,
  ) {
    this._keySubscription = keyHandler.onData((key) => {
      if (key.char === AnsiKey.INSERT) {
        if (this._inputMode === "normal") this._inputMode = "insert"
        else this._inputMode = "normal"
        return
      }
      if (key.char === AnsiKey.DELETE) {
        if (this._chars[this._cursorPos]) this._chars.splice(this._cursorPos, 1)
        return
      }
      if (key.char === "\b") {
        if (this._cursorPos >= 1) {
          this._chars.splice(this._cursorPos - 1, 1)
          this._cursorPos--
        }
        return
      }
      const char: ITextChar = { char: key.char, width: wcwidth(key.char) }
      if (this._inputMode === "normal") {
        if (this._cursorPos >= this._chars.length) this._chars.push(char)
        else this._chars.splice(this._cursorPos, 0, char)
      } else {
        if (this._cursorPos >= this._chars.length) this._chars.push(char)
        else this._chars[this._cursorPos] = char
      }
      this._cursorPos++
    })
  }

  dispose() {
    this._keySubscription.dispose()
    return
  }

  getInputMode(): InputMode {
    return this._inputMode
  }

  getTerminalStyle(): ITerminalStyle {
    return this.writer.getTerminalStyle()
  }

  getScreenBuffer(): IScreenBuffer {
    return this.writer.getScreenBufferView().getScreenBuffer()
  }

  getContent(): string {
    return this._chars.map((c) => c.char).join("")
  }
}
