import wcwidth from "wcwidth"
import { AnsiCursor } from "./ansi-code.ts"
import type {
  IScreenBuffer,
  IScreenBufferCell,
  IScreenBufferManager,
  IScreenBufferView,
} from "./buffer.interface.ts"
import type { IDimension, IRect, IStyleProvider, IWriteOption } from "./capabilities.interface.ts"
import { TerminalStyle } from "./capabilities.ts"
import type { ITextViewport } from "./text.interface.ts"
import { type CursorPosition } from "./types.ts"
import { assertValidCursorPosition } from "./utils.ts"

export class ScreenBufferCell extends TerminalStyle implements IScreenBufferCell {
  private _width = 0

  constructor(
    private readonly _row: number,
    private readonly _col: number,
    private _value: string = " ",
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
    this._value = val[0] || " "
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
    return this._cols
  }

  getRows(): number {
    return this._rows
  }
}

export class ScreenBufferView implements IScreenBufferView {
  constructor(
    private readonly _range: IRect,
    private readonly _buffer: IScreenBuffer,
  ) {}

  write(text: ITextViewport, option?: IWriteOption): this {
    const region = text.getRegion()
    for (
      let r = 0;
      r < region.endRow - region.startRow + 1 &&
      r + this._range.getStartPosition().row <= this._range.getEndPosition().row;
      r++
    ) {
      const chars = text.getChars(r + region.startRow)
      const accWidth = chars.reduce((pre, cur) => pre + cur.width, 0)
      let c = 0,
        i = 0
      if (option?.align === "center") {
        const bias = Math.floor((this._range.getCols() - accWidth) / 2)
        if (bias >= 0) c = bias
      } else if (option?.align === "right") {
        const bias = this._range.getCols() - accWidth
        if (bias >= 0) {
          c = bias
        }
      }
      console.log(chars, this._range.getCols(), accWidth, c, i)
      for (; i < chars.length; i++) {
        const char = chars[i]
        if (c + char.width <= this._range.getCols()) {
          const cell = this._buffer.getCell(
            r + this._range.getStartPosition().row,
            c + this._range.getStartPosition().col,
          )
          cell.setValue(char.char).copyFrom(char.style)
          c += char.width || 1
        } else {
          break
        }
      }
    }
    return this
  }

  getScreenBufferView(range: IRect): IScreenBufferView {
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

export class ScreenBufferManager implements IScreenBufferManager {
  private readonly _stack: IScreenBuffer[] = []

  constructor(buffer: IScreenBuffer) {
    this._stack.push(buffer)
  }

  getScreenBuffer(): IScreenBuffer {
    return this._stack.at(-1)!
  }

  add(styleProvider: IStyleProvider): this {
    const buffer = this.getScreenBuffer()
    this._stack.push(new ScreenBuffer(buffer.getRows(), buffer.getCols(), styleProvider))
    return this
  }

  pop() {
    if (this._stack.length === 1) throw new Error("Cannot pop the last buffer")
    this._stack.pop()
    this.getScreenBuffer().markFullUpdate()
    return this
  }
}
