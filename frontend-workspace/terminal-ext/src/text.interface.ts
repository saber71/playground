import type { ITerminalStyle } from "./capabilities.interface.ts"
import type { TerminalDimension } from "./types.ts"

export interface IStyledText extends ITerminalStyle {
  getValue(): string

  split(splitter: string | RegExp): IStyledText[]

  toChars(): ReadonlyArray<Readonly<ITextChar>>
}

export interface ITextChar {
  char: string
  width: number
  style: ITerminalStyle
}

export interface ITextRow {
  chars: ITextChar[]
  width: number
}

export interface ITextRegion {
  startRow: number
  endRow: number
  startIndex: number
  maxWidth: number
}

export interface ITextViewport {
  getChars(rowIndex: number): ReadonlyArray<Readonly<ITextChar>>

  getRegion(): Readonly<ITextRegion>
}

export interface ITextView {
  getViewport(region?: ITextRegion): ITextViewport

  setMaxWidth(val: number): this

  getDimension(): Readonly<TerminalDimension>

  update(force?: boolean): this
}
