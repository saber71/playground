import { isNil, parseColor } from "shared"
import wcwidth from "wcwidth"
import { AnsiBack, AnsiFore, AnsiReset, AnsiStyle } from "./ansi-code.ts"

export interface TerminalTextOption {
  bold: boolean
  italic: boolean
  underline: boolean
  inverse: boolean
  strikeThrough: boolean
  forecolor: string | number
  backcolor: string | number
}

export class TerminalText {
  private _width?: number

  constructor(
    readonly value: string,
    readonly option?: Partial<TerminalTextOption>,
  ) {}

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
          row.push(this.cloneOption(rowStr))
          rowStr = ""
          rowWidth = 0
        }
      } else {
        row.push(this.cloneOption(rowStr))
        rowWidth = width
        rowStr = this.value[i]!
      }
    }
    if (rowStr) {
      row.push(this.cloneOption(rowStr))
    }
    return row
  }

  cloneOption(value: string) {
    return new TerminalText(value, Object.assign({}, this.option))
  }

  slice(start?: number, end?: number) {
    return this.cloneOption(this.value.slice(start, end))
  }

  toString() {
    const option = this.option
    if (option) {
      const forecolor = !isNil(option.forecolor) ? parseColor(option.forecolor).join(";") : ""
      const backcolor = !isNil(option.backcolor) ? parseColor(option.backcolor).join(";") : ""
      const styles: number[] = []
      if (option.bold) styles.push(AnsiStyle.BOLD)
      if (option.italic) styles.push(AnsiStyle.ITALIC)
      if (option.strikeThrough) styles.push(AnsiStyle.STRIKE_THROUGH)
      if (option.inverse) styles.push(AnsiStyle.INVERSE)
      if (option.underline) styles.push(AnsiStyle.UNDERLINE)
      const codes: string[] = []
      if (styles.length) codes.push(styles.join(";"))
      if (forecolor) codes.push(AnsiFore + ";" + forecolor)
      if (backcolor) codes.push(AnsiBack + ";" + backcolor)
      if (codes.length) return `\x1B[${codes.join(";")}m${this.value}${AnsiReset}`
      return this.value
    } else return this.value
  }
}
