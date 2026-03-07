import type { IRect, ITerminalStyle } from "../capabilities.interface.ts"
import { TerminalStyle } from "../capabilities.ts"
import type { ITextChar } from "../text"
import type { IScreenBufferCell } from "./buffer-cell.interface.ts"
import type { ITextCellMatrixRow } from "./buffer-text-matrix.interface.ts"
import type { IScreenBufferView } from "./buffer-view.interface.ts"
import type { IScreenBufferWriter, IWriteOption } from "./buffer-writer.interface.ts"

export class ScreenBufferWriter implements IScreenBufferWriter {
  constructor(
    readonly view: IScreenBufferView,
    readonly style: ITerminalStyle = new TerminalStyle(),
  ) {
    for (let cell of this.view.getCells()) {
      cell.appendStyle(style)
    }
  }

  dispose(): this {
    for (let cell of this.view.getCells()) {
      cell.removeStyle(this.style)
    }
    return this
  }

  erase(): this {
    for (let cell of this.view.getCells()) {
      cell.setValue("")
    }
    return this
  }

  getTerminalStyle(): ITerminalStyle {
    return this.style
  }

  getScreenBufferView(range?: IRect): IScreenBufferView {
    return this.view.getScreenBufferView(range)
  }

  write(textRows: ITextCellMatrixRow[], option?: IWriteOption): this {
    const clear = option?.clear ?? true
    const cells: Array<ITextChar & { cell: IScreenBufferCell }> = []
    if (clear) {
      textRows = textRows.slice()
      const cols = this.view.getRange().getCols()
      const rows = this.view.getRange().getRows()
      const toCells = (args: IScreenBufferCell[] | number) => {
        if (typeof args === "number") args = this.view.getCellsByRow(args)
        cells.push(...args.map((cell) => ({ cell, char: " ", width: 1 })))
      }
      for (let i = 0; i < rows; i++) {
        if (textRows.length) {
          const textRow = textRows[0]
          if (textRow.cells.length) {
            const cell = textRow.cells[0]
            const cellRow = cell.getRow() - this.view.getRange().getStartPosition().row
            if (cellRow === i) {
              textRows.shift()
              const cellCol = cell.getCol() - this.view.getRange().getStartPosition().col
              const rowCells = this.view.getCellsByRow(i)
              const prevCells = rowCells.slice(0, cellCol)
              const afterCells = rowCells.slice(cellCol + textRow.width)
              toCells(prevCells)
              toCells(afterCells)
              cells.push(...textRow.cells.map((cell, i) => ({ cell, ...textRow.data[i] })))
            }
          } else toCells(i)
        } else toCells(i)
      }
    } else {
      for (let textRow of textRows) {
        cells.push(...textRow.cells.map((cell, i) => ({ cell, ...textRow.data[i] })))
      }
    }
    for (let cell of cells) {
      cell.cell.setValue(cell.char).setTextStyle(cell.style)
    }
    return this
  }
}
