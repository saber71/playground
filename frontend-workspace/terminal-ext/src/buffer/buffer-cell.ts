import wcwidth from "wcwidth"
import type { ITerminalStyle } from "../capabilities.interface.ts"
import { TerminalStyle } from "../capabilities.ts"
import type { IScreenBufferCell } from "./buffer-cell.interface.ts"

export class ScreenBufferCell implements IScreenBufferCell {
  private _width = 0
  private readonly _styles: ITerminalStyle[] = []
  private _textStyle: ITerminalStyle = new TerminalStyle()
  private readonly _style = new TerminalStyle()

  constructor(
    private readonly _row: number,
    private readonly _col: number,
    private _value: string = " ",
  ) {
    this._width = this._value[0] ? wcwidth(this._value[0]) : 0
  }

  copyFrom(other: ScreenBufferCell): this {
    this._value = other.getValue()
    this._width = other._width
    this._textStyle.copyFrom(other._textStyle)
    this._styles.length = 0
    this._styles.push(...other._styles.map((i) => new TerminalStyle(i)))
    return this
  }

  clone() {
    const result = new ScreenBufferCell(this._row, this._col, this._value)
    result._styles.push(...this._styles.map((i) => new TerminalStyle(i)))
    result._textStyle.copyFrom(this._textStyle)
    return result
  }

  appendStyle(style: ITerminalStyle): this {
    this._styles.push(style)
    return this
  }

  removeStyle(style: ITerminalStyle): this {
    const index = this._styles.indexOf(style)
    if (index >= 0) this._styles.splice(index, 1)
    return this
  }

  setTextStyle(style: ITerminalStyle): this {
    this._textStyle = style
    return this
  }

  getTerminalStyle(): ITerminalStyle {
    return this._style.reset().copyFrom(...this._styles, this._textStyle)
  }

  getWidth(): number {
    return this._width
  }

  getValue(): string {
    return this._value
  }

  setValue(val: string): this {
    this._value = val[0] || " "
    this._width = wcwidth(this._value) || 1
    return this
  }

  getCol(): number {
    return this._col
  }

  getRow(): number {
    return this._row
  }
}
