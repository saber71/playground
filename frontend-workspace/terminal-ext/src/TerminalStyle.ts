import { type Color, isNil, parseColor } from "shared"
import { AnsiBack, AnsiFore, AnsiReset, AnsiStyle } from "./ansi-code.ts"

export interface ITerminalStyle {
  bold: boolean
  italic: boolean
  underline: boolean
  inverse: boolean
  strikeThrough: boolean
  forecolor: Color | string | number
  backcolor: Color | string | number
}

export class TerminalStyle implements Partial<ITerminalStyle> {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  inverse?: boolean
  strikeThrough?: boolean
  forecolor?: Color | string | number
  backcolor?: Color | string | number
  parent?: TerminalStyle

  constructor(option?: Partial<ITerminalStyle>) {
    Object.assign(this, option)
  }

  setParent(val?: TerminalStyle) {
    this.parent = val
    return this
  }

  create(option?: Partial<ITerminalStyle>) {
    return new TerminalStyle(option).setParent(this)
  }

  get<Key extends keyof ITerminalStyle>(key: Key): TerminalStyle[Key] | undefined {
    let result = this[key]
    let parent = this.parent
    while (isNil(result) && parent) {
      result = parent[key] as any
      parent = parent.parent
    }
    return result
  }

  clone() {
    return new TerminalStyle(this)
  }

  toString(str: string = "", reset: boolean = true) {
    const fore = this.get("forecolor")
    const back = this.get("backcolor")
    const forecolor = !isNil(fore) ? parseColor(fore).join(";") : ""
    const backcolor = !isNil(back) ? parseColor(back).join(";") : ""
    const styles: number[] = []
    if (this.get("bold")) styles.push(AnsiStyle.BOLD)
    if (this.get("italic")) styles.push(AnsiStyle.ITALIC)
    if (this.get("strikeThrough")) styles.push(AnsiStyle.STRIKE_THROUGH)
    if (this.get("inverse")) styles.push(AnsiStyle.INVERSE)
    if (this.get("underline")) styles.push(AnsiStyle.UNDERLINE)
    const codes: string[] = []
    if (styles.length) codes.push(styles.join(";"))
    if (forecolor) codes.push(AnsiFore + ";" + forecolor)
    if (backcolor) codes.push(AnsiBack + ";" + backcolor)
    if (codes.length) return `\x1B[${codes.join(";")}m${str}${reset ? AnsiReset : ""}`
    return str
  }

  equal(other: TerminalStyle) {
    const props: Array<keyof ITerminalStyle> = [
      "forecolor",
      "backcolor",
      "bold",
      "italic",
      "inverse",
      "strikeThrough",
      "underline",
    ]
    for (let prop of props) {
      if (!this.get(prop) === other.get(prop)) return false
    }
    return true
  }
}
