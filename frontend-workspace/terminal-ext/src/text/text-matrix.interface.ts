import type { ITextChar } from "./text-char.interface.ts"

export interface ITextMatrixRow {
  data: ITextChar[]
  width: number
}

export interface IFoundTargetRow {
  row: ITextMatrixRow
  rowIndex: number
  charIndex: number
  // 计算从第一行到目标行的所有字符数量，包括目标行
  accLength: number
}

export interface ITextMatrixAppendOption {
  at?: number
  flush?: boolean
}

export interface ITextMatrixRemoveOption {
  deleteCount?: number
  flush?: boolean
}

export interface ITextMatrix {
  append(char: ITextChar, option?: ITextMatrixAppendOption): this

  remove(index?: number, option?: ITextMatrixRemoveOption): this

  getRows(): number

  getRow(row: number): ITextMatrixRow

  setWrapWidth(...widths: number[]): this

  findTargetRow(charIndex: number): IFoundTargetRow | undefined
}
