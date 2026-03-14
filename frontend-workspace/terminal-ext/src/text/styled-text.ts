import wcwidth from "wcwidth"
import { hasAnsiCode } from "../ansi-code"
import type { ITerminalStyle } from "../capabilities.interface.ts"
import { TerminalStyle } from "../capabilities.ts"
import type { IStyledText } from "./styled-text.interface.ts"
import type { ITextChar } from "./text-char.interface.ts"

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

  toChars(): ITextChar[] {
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
