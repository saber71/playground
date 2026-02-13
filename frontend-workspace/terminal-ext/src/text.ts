import wcwidth from "wcwidth"
import { hasAnsiCode } from "./ansi-code.ts"
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
  private readonly _texts: IStyledText[] = []
  private _maxWidth: number = 0
  private _dirty = true

  constructor(texts: IStyledText[]) {
    this._texts = texts
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
        }
      }
    }
    return new TextViewport(result, { startRow, startIndex, maxWidth, endRow })
  }

  update(force?: boolean): this {
    if (!this._dirty && !force) return this
    this._dirty = false
    if (!this._texts.length) {
      this._rows.length = 0
      return this
    }
    let row: ITextChar[] = []
    const rows: ITextChar[][] = [row]
    for (let text of this._texts) {
      const arr = text.split("\n")
      if (!arr.at(-1)?.getValue()) arr.pop()
      if (arr.length === 0) continue
      row.push(...arr[0].toChars())
      for (let i = 1; i < arr.length; i++) {
        row = arr[i].toChars().slice()
        rows.push(row)
      }
    }
    if (this._maxWidth <= 0) {
      this._rows.length = 0
      const allChars = rows.flat()
      this._rows.push({
        chars: allChars,
        width: allChars.reduce((acc, cur) => acc + cur.width, 0),
      })
    } else if (this._maxWidth === 1) {
      const allChars = rows.flat()
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
      for (let charRow of rows) {
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
