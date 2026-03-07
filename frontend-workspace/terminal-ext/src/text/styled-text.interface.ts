import type { ITerminalStyle } from "../capabilities.interface.ts"
import type { ITextChar } from "./text-char.interface.ts"

export interface IStyledText extends ITerminalStyle {
  getValue(): string

  split(splitter: string | RegExp): IStyledText[]

  toChars(): ITextChar[]
}
