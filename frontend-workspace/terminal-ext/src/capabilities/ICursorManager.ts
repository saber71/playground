import { Apply } from "shared"
import { AnsiCursor, type CursorPosition, parseAnsiCursorPosition } from "../ansi-code.ts"
import { type IWriter, Writer } from "./IWriter.ts"

export interface ICursorManager extends IWriter {
  showCursor(): this

  hideCursor(): this

  saveCursorPosition(): this

  restoreCursorPosition(): this

  getCursorPosition(): Promise<CursorPosition>

  // 1-based
  setCursorPosition(pos: CursorPosition): this
}

export class CursorManager extends Apply<IWriter>(Writer) implements ICursorManager {
  showCursor(): this {
    return this.write(AnsiCursor.SHOW)
  }

  hideCursor(): this {
    return this.write(AnsiCursor.HIDE)
  }

  saveCursorPosition(): this {
    return this.write(AnsiCursor.SAVE_POSITION)
  }

  restoreCursorPosition(): this {
    return this.write(AnsiCursor.RESTORE_POSITION)
  }

  async getCursorPosition(): Promise<CursorPosition> {
    const str = await this.writeEcho(AnsiCursor.REQUEST_POSITION)
    const pos = parseAnsiCursorPosition(str)
    if (!pos) throw new Error("Cursor position not found")
    return pos
  }

  setCursorPosition(pos: CursorPosition) {
    return this.write(AnsiCursor.SET_POSITION(pos.row, pos.col))
  }
}
