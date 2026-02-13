import type {
  ICellPosition,
  IDimension,
  IRect,
  IStyleProvider,
  ITerminalStyle,
} from "./capabilities.interface.ts"
import type { ITextViewport } from "./text.interface.ts"

export interface IScreenBuffer extends IDimension, IScreenBufferViewProvider {
  // 1-based
  getCell(row: number, col: number): IScreenBufferCell

  outputDiff(): string

  resize(dimension: IDimension): this

  markFullUpdate(): this
}

export interface IScreenBufferCell extends ITerminalStyle, ICellPosition {
  getValue(): string

  setValue(val: string): this

  getWidth(): number
}

export interface IScreenBufferProvider {
  getScreenBuffer(): IScreenBuffer
}

export interface IScreenBufferView extends IScreenBufferProvider, IScreenBufferViewProvider {
  getRange(): Readonly<IRect>

  write(text: ITextViewport): this
}

export interface IScreenBufferViewProvider {
  getIScreenBufferView(range: IRect): IScreenBufferView
}

export interface IScreenBufferManager extends IScreenBufferProvider {
  pop(): this

  add(styleProvider: IStyleProvider): this
}
