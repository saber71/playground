import { AnsiKey } from "../ansi-code"
import type { ITerminalStyle } from "../capabilities.interface.ts"
import type { IKeyBindingFactory, IKeyMatcher } from "../key"
import { createTextChar, type ITextChar, type ITextMatrix, TextMatrix } from "../text"
import type { InputMode, IScreenBufferEditor } from "./buffer-editor.interface.ts"
import type { IScreenBufferWriter } from "./buffer-writer.interface.ts"
import type { IScreenBuffer } from "./buffer.interface.ts"

export class ScreenBufferEditor implements IScreenBufferEditor {
  private _cursorPos = 0
  private _inputMode: InputMode = "normal"
  private readonly _textMatrix: ITextMatrix = new TextMatrix([createTextChar(" ")])
  private readonly _keyMatcher: IKeyMatcher

  constructor(
    readonly writer: IScreenBufferWriter,
    keyFactory: IKeyBindingFactory,
  ) {
    this._textMatrix.setWrapWidth(writer.getScreenBufferView().getCols())
    this._keyMatcher = keyFactory.createKeyMatcher()
    this._keyMatcher.pattern({ char: AnsiKey.INSERT }).bind(() => {
      if (this._inputMode === "normal") this._inputMode = "insert"
      else this._inputMode = "normal"
    })
    this._keyMatcher.pattern({ char: AnsiKey.DELETE }).bind(() => {
      if (this._cursorPos < this._textMatrix.getChars().length) {
        this._textMatrix.remove(this._cursorPos)
        this._render()
      }
    })
    this._keyMatcher.pattern({ char: "\b" }).bind(() => {
      if (this._cursorPos >= 1) {
        this._textMatrix.remove(this._cursorPos - 1)
        this._cursorPos--
        this._render()
      }
    })
    this._keyMatcher.pattern("*").bind((key) => {
      const char: ITextChar = createTextChar(key.char)
      const chars = this._textMatrix.getChars()
      if (this._inputMode === "normal") {
        this._textMatrix.append(char, { at: this._cursorPos })
      } else {
        if (this._cursorPos >= chars.length - 1)
          this._textMatrix.append(char, { at: this._cursorPos })
        else this._textMatrix.replace(this._cursorPos, char)
      }
      this._cursorPos++
      this._render()
    })
  }

  dispose() {
    this._keyMatcher.dispose()
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

  private _render() {}
}
