import type { ITextChar } from "./text-char.interface.ts"
import type {
  IFoundTargetRow,
  ITextMatrix,
  ITextMatrixAppendOption,
  ITextMatrixRemoveOption,
  ITextMatrixRow,
} from "./text-matrix.interface.ts"

export class TextMatrix implements ITextMatrix {
  private _wrapWidth: number[] = [0]
  private readonly _chars: ITextChar[]
  private _data: ITextMatrixRow[] = []
  private _updated = false

  constructor(chars: ITextChar[], ...widths: number[]) {
    this._chars = chars.slice()
    this.setWrapWidth(...widths)
  }

  findTargetRow(charIndex: number): IFoundTargetRow | undefined {
    if (charIndex >= this._chars.length) return undefined
    let i = 0,
      accLength = 0
    for (let row of this._data) {
      accLength += row.data.length
      if (charIndex >= row.data.length) {
        charIndex -= row.data.length
        i++
      } else {
        return {
          row,
          rowIndex: i,
          charIndex,
          accLength,
        }
      }
    }
  }

  getRows(): number {
    return this._data.length
  }

  getRow(row: number): ITextMatrixRow {
    return this._data[row]
  }

  append(chars: ITextChar | ITextChar[], option?: ITextMatrixAppendOption): this {
    if (!(chars instanceof Array)) chars = [chars]
    const at = option?.at
    const flush = option?.flush ?? true
    if (typeof at !== "number") {
      this._chars.push(...chars)
      if (flush) this._update(this._chars.length - 1)
      else this._updated = true
      return this
    } else {
      this._chars.splice(at, 0, ...chars)
      if (!flush) {
        this._updated = true
        return this
      }
      const targetRow = this.findTargetRow(at)
      if (targetRow) {
        targetRow.row.data.splice(targetRow.charIndex, targetRow.row.data.length)
        targetRow.row.width = 0
        targetRow.row.data.forEach((c) => (targetRow.row.width += c.width))
        if (targetRow.row.data.length) targetRow.rowIndex++
        this._data.splice(targetRow.rowIndex, this._data.length)
        return this._update(at)
      } else {
        return this.append(chars, { flush: option?.flush })
      }
    }
  }

  remove(index?: number, option?: ITextMatrixRemoveOption): this {
    const deleteCount = option?.deleteCount
    const flush = option?.flush ?? true
    if (typeof index !== "number") {
      this._chars.pop()
      if (!flush) {
        this._updated = true
        return this
      }
      let targetRow: ITextMatrixRow | undefined
      while ((targetRow = this._data.at(-1))) {
        const lastChar = targetRow.data.pop()
        if (lastChar) targetRow.width -= lastChar.width
        if (!lastChar || targetRow.width <= 0) this._data.splice(this._data.length - 1, 1)
        if (lastChar) break
      }
      return this
    } else {
      this._chars.splice(index, deleteCount)
      if (!flush) {
        this._updated = true
        return this
      }
      const targetRow = this.findTargetRow(index)
      if (targetRow) {
        const deleted = targetRow.row.data.splice(targetRow.charIndex, deleteCount)
        deleted.forEach((c) => (targetRow.row.width -= c.width))
        if (targetRow.row.width) targetRow.rowIndex++
        this._data.splice(targetRow.rowIndex, this._data.length)
        return this._update(targetRow.accLength - 1)
      } else {
        return this.remove()
      }
    }
  }

  setWrapWidth(...widths: number[]): this {
    if (widths.length === 0) widths = [0]
    this._wrapWidth = widths
    for (let i = 0; i < this._wrapWidth.length; i++) {
      this._wrapWidth[i] = Math.floor(this._wrapWidth[i])
    }
    this._data.length = 0
    return this._update(0)
  }

  private _update(startIndex: number) {
    if (this._updated) {
      startIndex = 0
      this._data.length = 0
    }
    this._updated = false
    if (this._chars.length === 0) {
      this._data.length = 0
      return this
    }
    const newRow = () => {
      const row: ITextMatrixRow = { data: [], width: 0 }
      this._data.push(row)
      return row
    }
    for (let char of this._chars.slice(startIndex)) {
      let row = this._data.at(-1)
      if (!row) {
        row = newRow()
      }
      if (char.char === "\n") throw new Error("不支持换行符")
      const wrapWidth = this._wrapWidth[this._data.length - 1] || this._wrapWidth.at(-1) || 0
      if (wrapWidth === 1 && row.data.length) {
        row = newRow()
      } else if (wrapWidth >= 2 && row.width + char.width > wrapWidth) {
        row = newRow()
      }
      row.data.push(char)
      row.width += char.width
    }
    return this
  }
}
