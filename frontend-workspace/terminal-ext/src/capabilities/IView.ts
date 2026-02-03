import { Apply, clamp } from "shared"
import { AnsiCursor, type CursorPosition } from "../ansi-code.ts"
import { ClearRange, type IClearRange } from "./IClearable.ts"
import { CursorManager, type ICursorManager } from "./ICursorManager.ts"

//@ts-ignore
export interface IView extends IClearRange, ICursorManager {
  setStartPosition(value: CursorPosition): this

  setEndPosition(value: CursorPosition): this
}

export class View
  extends Apply<ICursorManager & IClearRange>(CursorManager, ClearRange)
  implements IView
{
  private _startPosition?: CursorPosition
  private _endPosition?: CursorPosition

  setStartPosition(value: CursorPosition) {
    this._startPosition = value
    return this
  }

  setEndPosition(value: CursorPosition) {
    this._endPosition = value
    return this
  }

  getStartPosition() {
    if (!this._startPosition) this._startPosition = { row: 1, col: 1 }
    return this._startPosition
  }

  getEndPosition() {
    if (!this._endPosition) this._endPosition = { row: 1, col: 1 }
    return this._endPosition
  }

  setCursorPosition(pos: CursorPosition): this {
    const row = clamp(pos.row, this.getStartPosition().row, this.getEndPosition().row)
    const col = clamp(pos.col, this.getStartPosition().col, this.getEndPosition().col)
    return this.write(AnsiCursor.SET_POSITION(row, col))
  }
}
