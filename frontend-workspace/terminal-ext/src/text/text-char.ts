import wcwidth from "wcwidth"
import type { ITerminalStyle } from "../capabilities.interface.ts"
import type { ITextChar } from "./text-char.interface.ts"

export function createTextChar(char: string, style?: ITerminalStyle): ITextChar {
  return {
    char,
    style,
    width: wcwidth(char),
  }
}
