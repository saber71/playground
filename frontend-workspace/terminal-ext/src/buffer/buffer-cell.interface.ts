import type { IRect, IStyleProvider, ITerminalStyle } from "../capabilities.interface.ts"

export interface ICellPosition {
  getRow(): number

  getCol(): number
}

export interface IScreenBufferCell extends IStyleProvider, ICellPosition {
  getValue(): string

  setValue(val: string): this

  getWidth(): number

  appendStyle(style: ITerminalStyle): this

  removeStyle(style: ITerminalStyle): this

  setTextStyle(style?: ITerminalStyle): this

  clone(): IScreenBufferCell

  copyFrom(other: IScreenBufferCell): this
}

export interface IScreenBufferCellProvider {
  getCell(row: number, col: number): IScreenBufferCell

  getCells(range?: IRect): IScreenBufferCell[]
}
