import { Apply } from "shared"
import { AnsiErase } from "../ansi-code.ts"
import { CursorManager, type ICursorManager } from "./ICursorManager.ts"
import { AbstractRange, type IRange } from "./IRange.ts"
import { type IWriter, Writer } from "./IWriter.ts"

export interface IClearable extends IWriter {
  clear(): this
}

export interface IClearRange extends IRange, IClearable {}

export class ClearScreen extends Writer implements IClearable {
  clear(): this {
    return this.write(AnsiErase.SCREEN)
  }
}

export abstract class ClearRange
  extends Apply<IWriter & ICursorManager & IRange>(Writer, CursorManager, AbstractRange)
  implements IClearRange
{
  clear(): this {
    const startPos = this.getStartPosition()
    const endPos = this.getEndPosition()
    for (let c = startPos.col; c <= endPos.col; c++) {
      this.setCursorPosition({ row: startPos.row, col: c }).write(" ".repeat(this.getRows()))
    }
    return this
  }
}
