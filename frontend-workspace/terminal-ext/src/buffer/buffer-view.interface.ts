import type { IRect, ITerminalStyle } from "../capabilities.interface.ts"
import type { IScreenBufferCellProvider } from "./buffer-cell.interface.ts"
import type { IScreenBufferProvider } from "./buffer.interface.ts"

export interface IScreenBufferView
  extends IScreenBufferProvider, IScreenBufferViewProvider, IScreenBufferCellProvider {
  getRange(): Readonly<IRect>

  setRange(range: IRect): this

  getStyle(): ITerminalStyle

  erase(): this

  dispose(): this
}

export interface IScreenBufferViewProvider {
  getScreenBufferView(range?: IRect): IScreenBufferView
}
