import { clamp } from "@saber71/shared"
import type { IRect, ITerminalStyle } from "../capabilities.interface.ts"
import { clipRect, TerminalStyle } from "../capabilities.ts"
import type { CursorPosition } from "../types.ts"
import { assertValidCursorPosition, equal } from "../utils.ts"
import type { IScreenBufferCell } from "./buffer-cell.interface.ts"
import type { IScreenBufferView } from "./buffer-view.interface.ts"
import type { IScreenBuffer } from "./buffer.interface.ts"

export class ScreenBufferView implements IScreenBufferView {
  constructor(
    private _range: IRect,
    private readonly _buffer: IScreenBuffer,
    private readonly _style: ITerminalStyle = new TerminalStyle(),
  ) {
    this.setupCellStyle()
  }

  getCells(range?: IRect): IScreenBufferCell[] {
    const rect = range ? clipRect(this._range, range) : this._range
    return this._buffer.getCells(rect)
  }

  getCell(row: number, col: number): IScreenBufferCell {
    row = clamp(row, 0, this._range.getRows() - 1)
    col = clamp(col, 0, this._range.getCols() - 1)
    const startPos = this._range.getStartPosition()
    return this._buffer.getCell(row + startPos.row, col + startPos.col)
  }

  setRange(range: IRect): this {
    if (equal(range, this.getRange())) return this
    this.resetCellStyle()
    this._range = range
    return this.setupCellStyle()
  }

  setupCellStyle() {
    for (let cell of this._buffer.getCells(this._range)) {
      cell.appendStyle(this._style)
    }
    return this
  }

  resetCellStyle() {
    for (let cell of this._buffer.getCells(this._range)) {
      cell.removeStyle(this._style)
    }
    return this
  }

  dispose(): this {
    return this.resetCellStyle()
  }

  getStyle(): ITerminalStyle {
    return this._style
  }

  erase(): this {
    for (let cell of this._buffer.getCells(this._range)) {
      cell.setValue(" ")
    }
    return this
  }

  getScreenBufferView(range?: IRect): IScreenBufferView {
    if (!range) return this
    assertValidCursorPosition(range.getStartPosition(), range.getEndPosition())
    const startPosition: CursorPosition = {
      row: range.getStartPosition().row + this._range.getStartPosition().row,
      col: range.getStartPosition().col + this._range.getStartPosition().col,
    }
    const endPosition: CursorPosition = {
      row: range.getEndPosition().row + this._range.getEndPosition().row,
      col: range.getEndPosition().col + this._range.getEndPosition().col,
    }
    return new ScreenBufferView(
      {
        getEndPosition(): Readonly<CursorPosition> {
          return endPosition
        },
        getRows(): number {
          return range.getRows()
        },
        getStartPosition(): Readonly<CursorPosition> {
          return startPosition
        },
        getCols(): number {
          return range.getCols()
        },
      },
      this._buffer,
    )
  }

  getScreenBuffer(): IScreenBuffer {
    return this._buffer
  }

  getRange(): Readonly<IRect> {
    return this._range
  }
}
