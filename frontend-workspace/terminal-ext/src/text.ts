import wcwidth from "wcwidth"
import { hasAnsiCode } from "./ansi-code"
import type { ITerminalStyle } from "./capabilities.interface.ts"
import { TerminalStyle } from "./capabilities.ts"
import type {
  IStyledText,
  ITextChar,
  ITextRegion,
  ITextRow,
  ITextView,
  ITextViewport,
} from "./text.interface.ts"
import type { TerminalDimension } from "./types.ts"

export class StyledText extends TerminalStyle implements IStyledText {
  private _chars?: ITextChar[]

  constructor(
    readonly value: string,
    option?: Partial<ITerminalStyle>,
  ) {
    if (hasAnsiCode(value)) throw new Error("ansi code is not allowed")
    super(option)
  }

  getValue(): string {
    return this.value
  }

  split(splitter: string | RegExp): IStyledText[] {
    return this.value.split(splitter).map((i) => new StyledText(i, this))
  }

  toString(str: string = this.getValue(), reset: boolean = true) {
    return super.toString(str, reset)
  }

  toChars(): ReadonlyArray<Readonly<ITextChar>> {
    if (!this._chars) {
      this._chars = Array.from(this.value).map((c) => ({
        char: c,
        style: this,
        width: wcwidth(c),
      }))
    }
    return this._chars
  }
}

export class TextViewport implements ITextViewport {
  constructor(
    readonly rows: ITextRow[],
    readonly region: Readonly<ITextRegion>,
  ) {}

  getRegion(): Readonly<ITextRegion> {
    return this.region
  }

  getChars(rowIndex: number) {
    if (rowIndex >= this.rows.length) throw new Error("row index out of range")
    return this.rows[rowIndex].chars
  }
}

export class TextView implements ITextView {
  private readonly _dimension: TerminalDimension = { rows: 0, cols: 0 }
  private readonly _rows: ITextRow[] = []
  private readonly _rawRows: ITextChar[][] = []
  private _chars: ITextChar[]
  private _maxWidth: number = 0
  private _dirty = true
  private _rawRowsDirty = true

  constructor(texts: IStyledText[]) {
    this._chars = texts.map((i) => i.toChars()).flat()
    this.buildRawRows()
  }

  append(char: string, option?: { at?: number; style?: ITerminalStyle }): this {
    const textChar: ITextChar = {
      char,
      width: wcwidth(char),
      style: option?.style,
    }
    if (typeof option?.at !== "number") {
      if (char === "/n") {
        this._rawRows.push([])
      } else {
        this._chars.push(textChar)
        if (!this._rawRows.length) this._rawRows.push([])
        this._rawRows.at(-1)!.push(textChar)
      }
    } else if (option?.at <= 0) {
      if (char === "\n") this._rawRows.unshift([])
      else {
        if (!this._rawRows.length) this._rawRows.push([])
        this._rawRows[0].unshift(textChar)
        this._chars.unshift(textChar)
      }
    } else {
      const pre = this._chars.slice(0, option?.at)
      const after = this._chars.slice(option?.at)
      this._chars = [...pre, textChar, ...after]
      this._rawRowsDirty = true
    }
    return this
  }

  buildRawRows() {
    this._rawRows.length = 0
    let row: ITextChar[] = []
    for (let char of this._chars) {
      if (char.char === "\n") {
        this._rawRows.push(row)
        row = []
      } else {
        row.push(char)
      }
    }
    if (row.length) this._rawRows.push(row)
  }

  getDimension() {
    return this._dimension
  }

  setMaxWidth(val: number): this {
    if (val === this._maxWidth) return this
    this._maxWidth = val
    this._dirty = true
    return this
  }

  getViewport(region?: Partial<ITextRegion>): ITextViewport {
    if (!region)
      return new TextViewport(this._rows, {
        startRow: 0,
        endRow: this._rows.length - 1,
        startIndex: 0,
        maxWidth: -1,
      })
    const startRow = region.startRow ?? 0
    const endRow = region.endRow ?? this._rows.length - 1
    const maxWidth = region.maxWidth ?? Number.MAX_SAFE_INTEGER
    const startIndex = region.startIndex ?? 0
    const result: ITextRow[] = []
    for (let i = startRow; i <= endRow && i < this._rows.length; i++) {
      const row = this._rows[i]
      const resultRow: ITextRow = { chars: [], width: 0 }
      result.push(resultRow)
      for (let j = startIndex; j < row.chars.length && resultRow.width <= maxWidth; j++) {
        const char = row.chars[j]
        const accWidth = resultRow.width + char.width
        if (accWidth <= maxWidth) {
          resultRow.width = accWidth
          resultRow.chars.push(char)
        } else {
          break
        }
      }
    }
    return new TextViewport(result, { startRow, startIndex, maxWidth, endRow })
  }

  update(force?: boolean): this {
    if (!this._dirty && !force) return this
    this._dirty = false
    if (!this._chars.length) {
      this._rows.length = 0
      return this
    }
    if (this._rawRowsDirty) {
      this._rawRowsDirty = false
      this.buildRawRows()
    }
    if (this._maxWidth <= 0) {
      this._rows.length = 0
      const allChars = this._chars.slice()
      this._rows.push({
        chars: allChars,
        width: allChars.reduce((acc, cur) => acc + cur.width, 0),
      })
    } else if (this._maxWidth === 1) {
      const allChars = this._chars.slice()
      for (let char of allChars) {
        this._rows.push({
          chars: [char],
          width: char.width,
        })
      }
    } else {
      const newRow = () => {
        this._rows.push(row)
        row = { chars: [], width: 0 }
      }
      let row: ITextRow = { chars: [], width: 0 }
      for (let charRow of this._rawRows) {
        for (let char of charRow) {
          const accWidth = row.width + char.width
          if (accWidth <= this._maxWidth) {
            row.chars.push(char)
            row.width = accWidth
          } else {
            newRow()
            row.chars.push(char)
            row.width = char.width
          }
        }
        if (row.chars.length) {
          newRow()
        }
      }
    }
    this._dimension.rows = this._rows.length
    this._dimension.cols = Math.max(...this._rows.map((i) => i.width))
    return this
  }
}
