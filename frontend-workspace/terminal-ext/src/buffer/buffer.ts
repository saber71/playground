import { AnsiCursor } from "../ansi-code"
import type { IDimension, IRect, IStyleProvider } from "../capabilities.interface.ts"
import { type CursorPosition } from "../types.ts"
import { assertValidCursorPosition, isCursorPosition } from "../utils.ts"
import type { IScreenBufferCell } from "./buffer-cell.interface.ts"
import { ScreenBufferCell } from "./buffer-cell.ts"
import type { IBufferCursorController } from "./buffer-cursor.interface.ts"
import type { IScreenBufferView } from "./buffer-view.interface.ts"
import { ScreenBufferView } from "./buffer-view.ts"
import type { IScreenBuffer } from "./buffer.interface.ts"

export class ScreenBuffer implements IScreenBuffer {
  private _matrix: Array<IScreenBufferCell[]> = []
  private _oldStrings: string[][] = []
  private readonly _backupMap = new Map<any, IScreenBufferCell[]>()
  private _cursorOn: IScreenBufferCell
  private _cursorPosUpdated = true

  constructor(
    private _rows: number,
    private _cols: number,
    readonly styleProvider: IStyleProvider,
  ) {
    this.resize({
      getCols(): number {
        return _cols
      },
      getRows(): number {
        return _rows
      },
    })
    this._cursorOn = this.getCell(0, 0)
  }

  getCursorController(): IBufferCursorController {
    return null as any
  }

  cursorOn(pos: IScreenBufferCell | CursorPosition): this {
    if (isCursorPosition(pos)) {
      this._cursorOn = this.getCell(pos.row, pos.col)
    } else {
      this._cursorOn = pos
    }
    this._cursorPosUpdated = true
    return this
  }

  getCursorOn(): IScreenBufferCell {
    return this._cursorOn
  }

  save(key: any, range: IRect): this {
    this._backupMap.set(
      key,
      this.getCells(range).map((i) => i.clone()),
    )
    return this
  }

  restore(key: any): this {
    const cells = this._backupMap.get(key)
    if (cells) {
      for (let cell of cells) {
        try {
          this.getCell(cell.getRow(), cell.getCol()).copyFrom(cell)
        } catch (e) {
          console.error(e)
        }
      }
      this._backupMap.delete(key)
    }
    return this
  }

  getCells(range?: IRect): IScreenBufferCell[] {
    if (!range) return this._matrix.flat()
    const array: IScreenBufferCell[] = []
    const start = range.getStartPosition()
    const end = range.getEndPosition()
    for (let r = start.row; r <= end.row; r++) {
      for (let c = start.col; c <= end.col; c++) {
        array.push(this.getCell(r, c))
      }
    }
    return array
  }

  getScreenBufferView(range?: IRect): IScreenBufferView {
    const { _rows, _cols } = this
    const r = range ?? {
      getCols(): number {
        return _cols
      },
      getRows(): number {
        return _rows
      },
      getStartPosition(): Readonly<CursorPosition> {
        return { row: 1, col: 1 }
      },
      getEndPosition(): Readonly<CursorPosition> {
        return { row: _rows, col: _cols }
      },
    }
    assertValidCursorPosition(r.getEndPosition(), r.getStartPosition())
    return new ScreenBufferView(r, this)
  }

  markFullUpdate(): this {
    this._oldStrings = []
    for (let r = 0; r < this._rows; r++) {
      const array: string[] = []
      this._oldStrings.push(array)
      for (let c = 0; c < this._cols; c++) {
        array.push("")
      }
    }
    return this
  }

  outputDiff(): string {
    let array: string[] = []
    const cursorOn = this._cursorPosUpdated
      ? AnsiCursor.SET_POSITION(this._cursorOn.getRow(), this._cursorOn.getCol())
      : ""
    for (let r = 0; r < this._matrix.length; r++) {
      const cells = this._matrix[r]
      for (let c = 0; c < cells.length; ) {
        const cell = cells[c]
        const string = cell.getTerminalStyle().toString(cell.getValue(), true)
        if (this._oldStrings[r][c] !== string) {
          array.push(AnsiCursor.SET_POSITION(r + 1, c + 1) + string)
          this._oldStrings[r][c] = string
        }
        const step = cell.getWidth() || 1
        c += step
      }
    }
    this._cursorPosUpdated = false
    return array.join("") + cursorOn
  }

  resize(dimension: IDimension): this {
    this._rows = dimension.getRows()
    this._cols = dimension.getCols()
    const oldCells = this._matrix.slice()
    this._matrix = new Array(this._rows)
    for (let row = 0; row < this._matrix.length; row++) {
      if (row >= this._oldStrings.length) {
        this._oldStrings.push([])
      }
      if (this._oldStrings[row].length > this._cols)
        this._oldStrings[row] = this._oldStrings[row].slice(0, this._cols)
      while (this._oldStrings[row].length < this._cols) {
        this._oldStrings[row].push("")
      }
      const cells: IScreenBufferCell[] = []
      this._matrix[row] = cells
      if (row < oldCells.length) {
        const old = oldCells[row]
        cells.push(...old.slice(0, this._cols))
      }
      while (cells.length < this._cols) {
        const cell = new ScreenBufferCell(row, cells.length)
        cell.appendStyle(this.styleProvider.getTerminalStyle())
        cells.push(cell)
      }
    }
    return this
  }

  getCell(row: number, col: number): IScreenBufferCell {
    if (row < 0 || col < 0) throw new Error("Invalid row or col")
    const result = this._matrix[row]?.[col]
    if (!result) throw new Error("Invalid row or col")
    return result
  }

  getCols(): number {
    return this._cols
  }

  getRows(): number {
    return this._rows
  }
}
