import type { IRect } from "../capabilities.interface.ts"
import type { IScreenBufferCell, IScreenBufferCellProvider } from "./buffer-cell.interface.ts"
import type { IScreenBufferProvider } from "./buffer.interface.ts"

export interface IScreenBufferView
  extends IScreenBufferProvider, IScreenBufferViewProvider, IScreenBufferCellProvider {
  getRange(): Readonly<IRect>

  getCellsByRow(rowIndex: number): IScreenBufferCell[]

  getCellsByCol(colIndex: number): IScreenBufferCell[]
}

export interface IScreenBufferViewProvider {
  getScreenBufferView(range?: IRect): IScreenBufferView
}
