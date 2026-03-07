import type { ITextMatrix } from "../text"
import type { IScreenBufferCell } from "./buffer-cell.interface.ts"
import type {
  IScreenBufferTextMatrix,
  ITextCellMatrixRow,
  TextAlign,
} from "./buffer-text-matrix.interface.ts"
import type { IScreenBufferView } from "./buffer-view.interface.ts"

export class ScreenBufferTextMatrix implements IScreenBufferTextMatrix {
  private _align: TextAlign = "left"

  constructor(
    private readonly _textMatrix: ITextMatrix,
    private readonly _view: IScreenBufferView,
  ) {}

  setAlign(align: TextAlign): this {
    this._align = align
    return this
  }

  getRows(): ITextCellMatrixRow[] {
    const rows: ITextCellMatrixRow[] = []
    for (let r = 0; r < this._textMatrix.getRows(); r++) {
      rows.push(this.getRow(r))
    }
    return rows
  }

  getRow(rowIndex: number): ITextCellMatrixRow {
    const charRow = this._textMatrix.getRow(rowIndex)
    const row: ITextCellMatrixRow = {
      data: charRow.data.slice(),
      width: charRow.width,
      cells: [],
    }
    let col = this._getOffset(charRow.width)
    for (let char of row.data) {
      row.cells.push(this._view.getCell(rowIndex, col))
      col += char.width
    }
    return row
  }

  getCell(index: number): IScreenBufferCell | undefined {
    const targetCharRow = this._textMatrix.findTargetRow(index)
    if (targetCharRow) {
      let col = this._getOffset(targetCharRow.row.width)
      for (let i = 0; i < targetCharRow.row.data.length; i++) {
        if (i === targetCharRow.charIndex) return this._view.getCell(targetCharRow.rowIndex, col)
        col += targetCharRow.row.data[i].width
      }
    }
  }

  private _getOffset(rowWidth: number): number {
    if (this._align === "left") return 0
    if (this._align === "center")
      return Math.floor((this._view.getRange().getCols() - rowWidth) / 2)
    return this._view.getRange().getCols() - rowWidth
  }
}
