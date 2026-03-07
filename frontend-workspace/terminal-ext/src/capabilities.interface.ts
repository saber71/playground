import type { ActionChain, Color } from "@saber71/shared"
import type { CursorPosition } from "./types.ts"

// ============通用基础接口=============

export interface IDimension {
  getRows(): number

  getCols(): number
}

export interface IRect extends IDimension {
  getStartPosition(): Readonly<CursorPosition>

  getEndPosition(): Readonly<CursorPosition>
}

// ============终端输出样式=============

export interface ITerminalStyle {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  inverse?: boolean
  strikeThrough?: boolean
  forecolor?: Color | string | number
  backcolor?: Color | string | number
  parent?: ITerminalStyle

  reset(): this

  get<Key extends keyof ITerminalStyle>(key: Key): ITerminalStyle[Key] | undefined

  equals(other: ITerminalStyle): boolean

  toString(text?: string, reset?: boolean): string

  copyFrom(...other: ITerminalStyle[]): this
}

export interface IStyleProvider {
  getTerminalStyle(): ITerminalStyle
}

export interface IInputSource<Arg> {
  onData(): ActionChain<Arg>
}

export interface ITerminal extends IDimension, IInputSource<string> {
  write(data: any): Promise<void>
}
