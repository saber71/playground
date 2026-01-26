import type { FontStyleType, FontWeightType } from "../types.ts"
import { toKebabCase } from "./toKebabCase.ts"

export interface StringStyles {
  color: string
  background: string
  fontFamily: string
  fontStyle: FontStyleType
  fontWeight: FontWeightType
  textDecoration: string
}

export class StyledString {
  constructor(
    readonly value: string,
    readonly styles: Partial<StringStyles> = {},
  ) {}

  get length() {
    return this.value.length
  }

  sub(start?: number, end?: number) {
    return new StyledString(this.value.slice(start, end), { ...this.styles })
  }

  slice(start?: number, end?: number) {
    return this.sub(start, end).toHTMLString()
  }

  toHTMLString() {
    const attrs = Object.entries(this.styles).map((e) => `${toKebabCase(e[0])}:${e[1]}`)
    const styleStr = attrs.join(";")
    return `<span ${attrs.length ? `style="${styleStr}"` : ""}>${this.value}</span>`
  }
}
