import type { ITerminalStyle } from "../capabilities.interface.ts"
import { TerminalStyle } from "../capabilities.ts"
import type { ITextViewport } from "../text.interface.ts"
import type { IScreenBufferView } from "./buffer-view.interface.ts"
import type {
  IScreenBufferWriter,
  ITextCharCell,
  ITextCharCellArray,
  IWriteOption,
} from "./buffer-writer.interface.ts"

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

  getCells(text: ITextViewport, option?: IWriteOption): ReadonlyArray<Readonly<ITextCharCell>> {
    const cells: ITextCharCell[] = []
    const view = this.view
    const region = text.getRegion()
    const range = view.getRange()
    for (
      let r = 0;
      r < region.endRow - region.startRow + 1 &&
      r + range.getStartPosition().row <= range.getEndPosition().row;
      r++
    ) {
      const chars = text.getChars(r + region.startRow)
      const accWidth = chars.reduce((pre, cur) => pre + cur.width, 0)
      let c = 0,
        i = 0
      if (option?.align === "center") {
        const bias = Math.floor((range.getCols() - accWidth) / 2)
        if (bias >= 0) c = bias
      } else if (option?.align === "right") {
        const bias = range.getCols() - accWidth
        if (bias >= 0) {
          c = bias
        }
      }
      for (; i < chars.length; i++) {
        const char = chars[i]
        if (c + char.width <= range.getCols()) {
          const cell = view.getCell(r, c)
          cells.push({ ...char, cell })
          c += char.width || 1
        } else {
          break
        }
      }
    }
    return cells
  }

  write(text: ITextViewport, option?: IWriteOption): ITextCharCellArray {
    const cells = this.getCells(text, option)
    for (let cell of cells) {
      cell.cell.setValue(cell.char).setTextStyle(cell.style)
    }
    return cells
  }
}
