import type { IStyleProvider } from "../capabilities.interface.ts"
import type { ITextChar, ITextViewport } from "../text.interface.ts"
import type { IDisposable } from "../types.ts"
import type { IScreenBufferCell } from "./buffer-cell.interface.ts"

export interface IWriteOption {
  align?: "left" | "center" | "right"
}

export interface ITextCharCell extends ITextChar {
  cell: IScreenBufferCell
}

export type ITextCharCellArray = ReadonlyArray<Readonly<ITextCharCell>>

export interface IScreenBufferWriter extends IStyleProvider, IDisposable {
  getCells(text: ITextViewport, option?: IWriteOption): ITextCharCellArray

  write(text: ITextViewport, option?: IWriteOption): ITextCharCellArray

  erase(): this
}
