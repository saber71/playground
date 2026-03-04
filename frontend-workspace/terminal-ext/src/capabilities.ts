import { type Color, isNil, parseColor } from "@saber71/shared"
import deepEqual from "deep-equal"
import { AnsiBack, AnsiFore, AnsiReset, AnsiStyle } from "./ansi-code"
import type { IRect, ITerminalStyle } from "./capabilities.interface.ts"
import type { CursorPosition } from "./types.ts"
import { clampPos, posAdd } from "./utils.ts"

export function clipRect(rect: IRect, sub: IRect) {
  const startPosition = clampPos(
    posAdd(rect.getStartPosition(), sub.getStartPosition()),
    rect.getStartPosition(),
    rect.getEndPosition(),
  )
  const endPosition = clampPos(
    posAdd(rect.getEndPosition(), sub.getEndPosition()),
    rect.getStartPosition(),
    rect.getEndPosition(),
  )
  return createRect(startPosition, endPosition)
}

export function createRect(start: CursorPosition, end: CursorPosition): IRect {
  return {
    getCols(): number {
      return end.col - start.col + 1
    },
    getRows(): number {
      return end.row - start.row + 1
    },
    getStartPosition(): Readonly<CursorPosition> {
      return start
    },
    getEndPosition(): Readonly<CursorPosition> {
      return end
    },
  }
}

export function isRect(arg: any): arg is IRect {
  return typeof arg?.getStartPosition === "function" && typeof arg?.getEndPosition === "function"
}

export class TerminalStyle implements ITerminalStyle {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  inverse?: boolean
  strikeThrough?: boolean
  forecolor?: Color | string | number
  backcolor?: Color | string | number
  parent?: ITerminalStyle

  constructor(option?: Partial<ITerminalStyle>) {
    Object.assign(this, option)
  }

  reset(): this {
    this.bold = undefined
    this.italic = undefined
    this.underline = undefined
    this.inverse = undefined
    this.strikeThrough = undefined
    this.forecolor = undefined
    this.backcolor = undefined
    return this
  }

  equals(other: ITerminalStyle): boolean {
    if (other === this) return true
    const props: Array<keyof ITerminalStyle> = [
      "bold",
      "italic",
      "underline",
      "inverse",
      "strikeThrough",
      "forecolor",
      "backcolor",
    ]
    for (let prop of props) {
      if (!deepEqual(this.get(prop), other.get(prop))) return false
    }
    return true
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

  copyFrom(...other: ITerminalStyle[]): this {
    const props: Array<keyof ITerminalStyle> = [
      "bold",
      "italic",
      "underline",
      "inverse",
      "strikeThrough",
      "forecolor",
      "backcolor",
    ]
    for (let item of other) {
      for (let prop of props) {
        if (isNil(item.get(prop))) continue
        ;(this as any)[prop] = item.get(prop)
      }
    }
    return this
  }
}
