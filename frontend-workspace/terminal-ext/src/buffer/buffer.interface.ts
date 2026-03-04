import type { IDimension, IRect } from "../capabilities.interface.ts"
import type { CursorPosition } from "../types.ts"
import type { IScreenBufferCell, IScreenBufferCellProvider } from "./buffer-cell.interface.ts"
import type { IBufferCursorController } from "./buffer-cursor.interface.ts"
import type { IScreenBufferViewProvider } from "./buffer-view.interface.ts"

export interface IScreenBuffer
  extends IDimension, IScreenBufferViewProvider, IScreenBufferCellProvider {
  outputDiff(): string

  resize(dimension: IDimension): this

  markFullUpdate(): this

  save(key: any, range: IRect): this

  restore(key: any): this

  cursorOn(pos: IScreenBufferCell | CursorPosition): this

  getCursorOn(): IScreenBufferCell

  getCursorController(): IBufferCursorController
}

export interface IScreenBufferProvider {
  getScreenBuffer(): IScreenBuffer
}
