import type {
  ICellPosition,
  IDimension,
  IRect,
  IStyleProvider,
  ITerminalStyle,
  IWriteOption,
} from "./capabilities.interface.ts"
import type { ITextViewport } from "./text.interface.ts"

export interface IScreenBuffer extends IDimension, IScreenBufferViewProvider {
  // 1-based
  getCell(row: number, col: number): IScreenBufferCell

  outputDiff(): string

  resize(dimension: IDimension): this

  markFullUpdate(): this

  getCells(range?: IRect): IScreenBufferCell[]
}

export interface IScreenBufferCell extends IStyleProvider, ICellPosition {
  getValue(): string

  setValue(val: string): this

  getWidth(): number

  appendStyle(style: ITerminalStyle): this

  removeStyle(style: ITerminalStyle): this

  setTextStyle(style: ITerminalStyle): this
}

export interface IScreenBufferProvider {
  getScreenBuffer(): IScreenBuffer
}

export interface IScreenBufferView extends IScreenBufferProvider, IScreenBufferViewProvider {
  getRange(): Readonly<IRect>

  write(text: ITextViewport, option?: IWriteOption): this

  getStyle(): ITerminalStyle

  erase(): this

  dispose(): this
}

export interface IScreenBufferViewProvider {
  getScreenBufferView(range?: IRect): IScreenBufferView
}

export interface IScreenBufferManager extends IScreenBufferProvider {
  pop(): this

  add(styleProvider: IStyleProvider): this
}

export interface IScreenBufferManagerProvider {
  getScreenBufferManager(): IScreenBufferManager
}
