import type { PartialCssStyles } from "../../types.ts"
import { Value } from "../../utils"

export interface Styleable {
  style(name: keyof CSSStyleDeclaration, value: string | Value<string>): this

  styles(record: PartialCssStyles): this

  styleProperty(name: string, value: string | Value<string>): this
}
