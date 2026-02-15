import type { IRect } from "./capabilities.interface.ts"
import type { CursorPosition } from "./types.ts"

export interface ILineMode {
  mode?: "light" | "heavy" | "double"
}

export interface ILineOption extends CursorPosition, ILineMode {
  left?: boolean
  top?: boolean
  right?: boolean
  bottom?: boolean
}

export interface ITerminalLines {
  write(option: ILineOption): this

  writeRect(rect: IRect, option?: ILineMode): this
}

export interface ITerminalLinesProvider {
  getTerminalLines(): ITerminalLines
}
