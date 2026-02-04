import { TerminalStyle } from "./TerminalStyle.ts"
import type { TerminalText } from "./TerminalText.ts"
import type { CursorPosition, StopListener } from "./types.ts"

export interface ITerminal extends IDimension {
  onData(listener: (str: string, stop: StopListener) => void, once?: boolean): void

  write(data: any): Promise<void>
}

export interface IStyleProvider {
  getTerminalStyle(): TerminalStyle
}

export interface ITerminalProvider {
  getTerminal(): ITerminal
}

export interface IDimension {
  getRows(): number

  getCols(): number
}

export interface IRect extends IDimension {
  getStartPosition(): Readonly<CursorPosition>

  getEndPosition(): Readonly<CursorPosition>
}

export interface IViewport extends IRect {
  setStartPosition(value: CursorPosition): this

  setEndPosition(value: CursorPosition): this
}

export interface IEraser extends ITerminalProvider {
  erase(view: IRect, style: IStyleProvider): Promise<void>
}

export interface IWriter extends ITerminalProvider {
  write(data: TerminalText[], view: IRect, style: IStyleProvider): Promise<void>
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
  extends IEraser, IViewport, IStyleProvider, ICursorControl, ICursorPositionable, IWriter {}
