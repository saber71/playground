import type { Color } from "shared"
import type { ITextViewport } from "./text.interface.ts"
import type { CursorPosition, StopListener } from "./types.ts"

// ============通用基础接口=============

export interface IDimension {
  getRows(): number

  getCols(): number
}

export interface IRect extends IDimension {
  getStartPosition(): Readonly<CursorPosition>

  getEndPosition(): Readonly<CursorPosition>
}

export interface IViewport extends IRect {
  getParent(): IViewport | undefined | null

  setStartPosition(value: CursorPosition): this

  setEndPosition(value: CursorPosition): this
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

  get<Key extends keyof ITerminalStyle>(key: Key): ITerminalStyle[Key] | undefined

  equals(other: ITerminalStyle): boolean

  toString(text?: string, reset?: boolean): string
}

export interface IStyleProvider {
  getTerminalStyle(): ITerminalStyle
}

// ============终端功能性接口=============

export interface ITerminal extends IDimension {
  onData(listener: (str: string, stop: StopListener) => void, once?: boolean): void

  write(data: any): Promise<void>
}

export interface ITerminalProvider {
  getTerminal(): ITerminal
}

export interface IEraser extends ITerminalProvider {
  erase(view: IRect, style: IStyleProvider): Promise<void>
}

export interface IWriteOption {
  align?: "left" | "center" | "right"
}

export interface IWriter extends ITerminalProvider {
  write(
    data: ITextViewport,
    renderArea: IRect,
    style: IStyleProvider,
    options?: IWriteOption,
  ): Promise<void>
}

export interface ICursorControl extends ITerminalProvider {
  showCursor(): Promise<void>

  hideCursor(): Promise<void>

  saveCursorPosition(): Promise<void>

  restoreCursorPosition(): Promise<void>
}

/**
 * 表示一个可查询和设置光标位置的组件。
 * 所有 CursorPosition 坐标均相对于该组件自身的左上角（0,0）。
 */
export interface ICursorPositionable extends ITerminalProvider {
  getCursorPosition(view?: IRect): Promise<CursorPosition>

  setCursorPosition(pos: CursorPosition, view?: IRect): Promise<void>
}

export interface IBox
  extends IEraser, IViewport, IStyleProvider, ICursorControl, ICursorPositionable, IWriter {
  create(style?: Partial<ITerminalStyle>): IBox
}
