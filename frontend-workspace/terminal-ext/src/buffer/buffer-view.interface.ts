import type { IRect } from "../capabilities.interface.ts"
import type { IScreenBufferCellProvider } from "./buffer-cell.interface.ts"
import type { IScreenBufferProvider } from "./buffer.interface.ts"

export interface IScreenBufferView
  extends IScreenBufferProvider, IScreenBufferViewProvider, IScreenBufferCellProvider {
  getRange(): Readonly<IRect>
}

export interface IScreenBufferViewProvider {
  getScreenBufferView(range?: IRect): IScreenBufferView
}
