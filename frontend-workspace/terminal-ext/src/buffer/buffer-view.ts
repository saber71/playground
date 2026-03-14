import { clamp } from "@saber71/shared"
import type { IRect } from "../capabilities.interface.ts"
import { clipRect, createRect } from "../capabilities.ts"
import type { CursorPosition } from "../types.ts"
import { assertValidCursorPosition, posAdd } from "../utils.ts"
import type { IScreenBufferCell } from "./buffer-cell.interface.ts"
import type { IScreenBufferView } from "./buffer-view.interface.ts"
import type { IScreenBuffer } from "./buffer.interface.ts"

export class ScreenBufferView implements IScreenBufferView {
  constructor(
    private _range: IRect,
    private readonly _buffer: IScreenBuffer,
  ) {}

  getCellsByRow(rowIndex: number): IScreenBufferCell[] {
    return this.getCells(
      createRect({ row: rowIndex, col: 0 }, { row: rowIndex, col: this._range.getCols() - 1 }),
    )
  }

  getCellsByCol(colIndex: number): IScreenBufferCell[] {
    return this.getCells(
      createRect({ row: 0, col: colIndex }, { row: this._range.getRows() - 1, col: colIndex }),
    )
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

  getScreenBufferView(range?: IRect): IScreenBufferView {
    if (!range) return this
    assertValidCursorPosition(range.getStartPosition(), range.getEndPosition())
    const startPosition = posAdd(range.getStartPosition(), this._range.getStartPosition())
    const endPosition = posAdd(range.getEndPosition(), this._range.getEndPosition())
    return new ScreenBufferView(createRect(startPosition, endPosition), this._buffer)
  }

  getScreenBuffer(): IScreenBuffer {
    return this._buffer
  }

  getRange(): Readonly<IRect> {
    return this._range
  }

  getRows(): number {
    return this.getRange().getRows()
  }

  getCols(): number {
    return this.getRange().getCols()
  }

  getStartPosition(): Readonly<CursorPosition> {
    return this.getRange().getStartPosition()
  }

  getEndPosition(): Readonly<CursorPosition> {
    return this.getRange().getEndPosition()
  }
}
