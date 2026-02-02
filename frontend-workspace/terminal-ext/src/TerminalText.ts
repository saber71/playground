import wcwidth from "wcwidth"
import { TerminalStyle, type TerminalStyleOption } from "./TerminalStyle.ts"

export class TerminalText extends TerminalStyle {
  private _width?: number

  constructor(
    readonly value: string,
    option?: Partial<TerminalStyleOption>,
  ) {
    super(option)
  }

  static width(...array: TerminalText[]) {
    return array.map((i) => i.getWidth()).reduce((pre, cur) => pre + cur, 0)
  }

  static wrap(maxWidth: number, ...array: TerminalText[]) {
    let accWidth = 0
    let row: TerminalText[] = []
    const rows: TerminalText[][] = [row]
    for (let item of array.filter((i) => i.value.length > 0)) {
      const width = item.getWidth()
      if (accWidth + width <= maxWidth) {
        accWidth += width
        row.push(item)
      } else {
        const least = maxWidth - accWidth
        if (least === 0) {
          row = []
          rows.push(row)
        } else {
          const wrapped = item.wrap(least, maxWidth)
          let start = 0
          let first = wrapped[start]!
          if (first.getWidth() <= least) {
            row.push(first)
            start++
          }
          rows.push(...wrapped.slice(start).map((i) => [i]))
          row = rows.at(-1)!
          accWidth = TerminalText.width(...row)
          if (accWidth === maxWidth) {
            accWidth = 0
            row = []
            rows.push(row)
          }
        }
      }
    }
    return rows
  }

  create(options?: Partial<TerminalStyleOption & { value: string }>) {
    return new TerminalText(options?.value ?? "", options).setParent(this)
  }

  getWidth() {
    if (typeof this._width === "number") return this._width
    return (this._width = wcwidth(this.value))
  }

  wrap(...maxWidth: number[]): TerminalText[] {
    if (!maxWidth.length) return [this]
    maxWidth = maxWidth.map((i) => Math.round(i))
    const maxWidthLimit = Math.max(...maxWidth)
    if (maxWidthLimit <= 0) return [this]
    let row: TerminalText[] = []
    const widths = this.value.split("").map((i) => wcwidth(i))
    let rowWidth = 0
    let rowStr = ""
    for (let i = 0; i < widths.length; i++) {
      const width = widths[i]!
      const widthLimit = maxWidth[row.length] ?? maxWidth.at(-1)!
      if (rowWidth + width <= widthLimit || (widthLimit === maxWidthLimit && width > widthLimit)) {
        rowWidth += width
        rowStr += this.value[i]
        if (this.value[i] === "\n") {
          row.push(this.clone(rowStr))
          rowStr = ""
          rowWidth = 0
        }
      } else {
        row.push(this.clone(rowStr))
        rowWidth = width
        rowStr = this.value[i]!
      }
    }
    if (rowStr) {
      row.push(this.clone(rowStr))
    }
    return row
  }

  clone(value: string = this.value) {
    return new TerminalText(value, Object.assign({}, this))
  }

  slice(start?: number, end?: number) {
    return this.clone(this.value.slice(start, end))
  }

  toString() {
    return super.toString(this.value)
  }
}
