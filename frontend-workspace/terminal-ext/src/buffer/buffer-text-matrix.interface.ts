import type { ITextMatrixRow } from "../text"
import type { IScreenBufferCell } from "./buffer-cell.interface.ts"

export interface ITextCellMatrixRow extends ITextMatrixRow {
  cells: IScreenBufferCell[]
}

export type TextAlign = "left" | "center" | "right"

export interface IScreenBufferTextMatrix {
  getRows(): ITextCellMatrixRow[]

  getRow(rowIndex: number): ITextCellMatrixRow

  getCell(index: number): IScreenBufferCell | undefined

  setAlign(align: TextAlign): this
}
