import { AnsiKey } from "../ansi-code"
import type { ITerminalStyle } from "../capabilities.interface.ts"
import type { IKeyHandler } from "../key"
import { createTextChar, type ITextChar, type ITextMatrix, TextMatrix } from "../text"
import type { InputMode, IScreenBufferEditor } from "./buffer-editor.interface.ts"
import type { IScreenBufferWriter } from "./buffer-writer.interface.ts"
import type { IScreenBuffer } from "./buffer.interface.ts"

export class ScreenBufferEditor implements IScreenBufferEditor {
  private readonly _id = Symbol()
  private _cursorPos = 0
  private _inputMode: InputMode = "normal"
  private readonly _textMatrix: ITextMatrix = new TextMatrix([])

  constructor(
    readonly writer: IScreenBufferWriter,
    readonly keyHandler: IKeyHandler,
  ) {
    this._textMatrix.setWrapWidth(writer.getScreenBufferView().getRange().getCols())
    keyHandler
      .onData()
      .child(this._id)
      .bind((key) => {
        if (key.char === AnsiKey.INSERT) {
          if (this._inputMode === "normal") this._inputMode = "insert"
          else this._inputMode = "normal"
          return
        }
        if (key.char === AnsiKey.DELETE) {
          if (this._cursorPos < this._textMatrix.getChars().length)
            this._textMatrix.remove(this._cursorPos)
          return
        }
        if (key.char === "\b") {
          if (this._cursorPos >= 1) {
            this._textMatrix.remove(this._cursorPos - 1)
            this._cursorPos--
          }
          return
        }
        const char: ITextChar = createTextChar(key.char)
        const chars = this._textMatrix.getChars()
        if (this._inputMode === "normal") {
          if (this._cursorPos >= chars.length) this._textMatrix.append(char)
          else this._textMatrix.append(char, { at: this._cursorPos })
        } else {
          if (this._cursorPos >= chars.length) this._textMatrix.append(char)
          else this._textMatrix.replace(this._cursorPos, char)
        }
        this._cursorPos++
      })
  }

  dispose() {
    this.keyHandler.onData().disposeChild(this._id)
    return
  }

  setCursorPos(charIndex: number): this {
    this._cursorPos = charIndex
    return this
  }

  getCursorPos(): number {
    return this._cursorPos
  }

  getTextMatrix(): ITextMatrix {
    return this._textMatrix
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
    return this._textMatrix
      .getChars()
      .map((c) => c.char)
      .join("")
  }
}
