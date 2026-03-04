import type { IRect, ITerminalStyle, IWriteOption } from "../capabilities.interface.ts"
import type { ITextViewport } from "../text.interface.ts"
import type { IScreenBufferCellProvider } from "./buffer-cell.interface.ts"
import type { IScreenBufferProvider } from "./buffer.interface.ts"

export interface IScreenBufferView
  extends IScreenBufferProvider, IScreenBufferViewProvider, IScreenBufferCellProvider {
  getRange(): Readonly<IRect>

  setRange(range: IRect): this

  write(text: ITextViewport, option?: IWriteOption): this

  getStyle(): ITerminalStyle

  erase(): this

  dispose(): this
}

export interface IScreenBufferViewProvider {
  getScreenBufferView(range?: IRect): IScreenBufferView
}
