import wcwidth from "wcwidth"
import { AnsiCursor } from "./ansi-code.ts"
import type { IScreenBuffer, IScreenBufferCell } from "./buffer.interface.ts"
import type { IDimension, IStyleProvider } from "./capabilities.interface.ts"
import { TerminalStyle } from "./capabilities.ts"

export class ScreenBufferCell extends TerminalStyle implements IScreenBufferCell {
  private _width = 0

  constructor(
    private readonly _row: number,
    private readonly _col: number,
    private _value: string = "",
  ) {
    super()
    this._width = this._value[0] ? wcwidth(this._value[0]) : 0
  }

  getWidth(): number {
    return this._width
  }

  getValue(): string {
    return this._value
  }

  setValue(val: string): this {
    this._value = val
    this._width = val[0] ? wcwidth(val[0]) : 0
    return this
  }

  getCols(): number {
    return this._col
  }

  getRows(): number {
    return this._row
  }
}

export class ScreenBuffer implements IScreenBuffer {
  private _matrix: Array<IScreenBufferCell[]> = []
  private _oldStrings: string[][] = []

  constructor(
    private _row: number,
    private _col: number,
    readonly styleProvider: IStyleProvider,
  ) {}

  markFullUpdate(): this {
    this._oldStrings = []
    for (let r = 0; r < this._row; r++) {
      const array: string[] = []
      this._oldStrings.push(array)
      for (let c = 0; c < this._col; c++) {
        array.push("")
      }
    }
    return this
  }

  outputDiff(): string {
    let array: string[] = []
    for (let r = 0; r < this._matrix.length; r++) {
      const cells = this._matrix[r]
      for (let c = 0; c < cells.length; ) {
        const cell = cells[c]
        const string = cell.toString(cell.getValue(), true)
        if (this._oldStrings[r][c] !== string) {
          array.push(AnsiCursor.SET_POSITION(r + 1, c + 1) + string)
          this._oldStrings[r][c] = string
        }
        const step = cell.getWidth() || 1
        c += step
      }
    }
    return array.join("")
  }

  resize(dimension: IDimension): this {
    this._row = dimension.getRows()
    this._col = dimension.getCols()
    const oldCells = this._matrix.slice()
    this._matrix = new Array(this._row)
    for (let row = 0; row < this._matrix.length; row++) {
      if (row >= this._oldStrings.length) {
        this._oldStrings.push([])
      }
      if (this._oldStrings[row].length > this._col)
        this._oldStrings[row] = this._oldStrings[row].slice(0, this._col)
      while (this._oldStrings[row].length < this._col) {
        this._oldStrings[row].push("")
      }
      const cells: IScreenBufferCell[] = []
      this._matrix.push(cells)
      if (row < oldCells.length) {
        const old = oldCells[row]
        cells.push(...old.slice(0, this._col))
      }
      while (cells.length < this._col) {
        const cell = new ScreenBufferCell(row + 1, cells.length + 1)
        cell.parent = this.styleProvider.getTerminalStyle()
        cells.push(cell)
      }
    }
    return this
  }

  getCell(row: number, col: number): IScreenBufferCell {
    if (row <= 0 || col <= 0) throw new Error("Invalid row or col")
    row -= 1
    col -= 1
    return this._matrix[row][col]
  }

  getCols(): number {
    return this._col
  }

  getRows(): number {
    return this._row
  }
}
