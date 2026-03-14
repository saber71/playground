import type { ITerminalStyle } from "../capabilities.interface.ts"

export interface ITextChar {
  char: string
  width: number
  style?: ITerminalStyle
}
