import type { CursorPosition } from "./types.ts"

export interface ILineOption extends CursorPosition {
  left?: boolean
  top?: boolean
  right?: boolean
  bottom?: boolean
  mode?: "light" | "heavy" | "double"
}

export interface ITerminalLines {
  write(option: ILineOption): this
}

export interface ITerminalLinesProvider {
  getTerminalLines(): ITerminalLines
}
