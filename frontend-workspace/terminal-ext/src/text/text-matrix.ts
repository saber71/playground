import type { ITextChar } from "./text-char.interface.ts"
import type {
  IFoundTargetRow,
  ITextMatrix,
  ITextMatrixAppendOption,
  ITextMatrixRemoveOption,
  ITextMatrixReplaceOption,
  ITextMatrixRow,
  ITextMatrixRowCell,
} from "./text-matrix.interface.ts"

export class TextMatrix implements ITextMatrix {
  private _wrapWidth: number[] = [0]
  private readonly _chars: ITextMatrixRowCell[]
  private _data: ITextMatrixRow[] = []
  private _updated = false

  constructor(chars: ITextChar[], ...widths: number[]) {
    this._chars = chars.slice().map((i) => ({ ...i, row: 0, col: 0 }))
    this.setWrapWidth(...widths)
  }

  findTargetRow(charIndex: number): IFoundTargetRow | undefined {
    if (charIndex >= this._chars.length) return undefined
    let i = 0,
      accLength = 0,
      accWidth = 0
    for (let row of this._data) {
      accLength += row.data.length
      if (charIndex >= row.data.length) {
        charIndex -= row.data.length
        i++
      } else {
        row.data.slice(0, charIndex + 1).forEach((c) => (accWidth += c.width))
        return {
          row,
          rowIndex: i,
          charIndex,
          accLength,
          accWidth,
        }
      }
    }
  }

  getChars(): ITextMatrixRowCell[] {
    return this._chars
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
      this._chars.push(...this._getTextMatrixRowCells(chars))
      if (flush) this._update(this._chars.length - 1)
      else this._updated = true
      return this
    } else {
      this._chars.splice(at, 0, ...this._getTextMatrixRowCells(chars))
      if (!flush) {
        this._updated = true
        return this
      }
      const targetRow = this.findTargetRow(at)
      if (targetRow) {
        targetRow.row.data.splice(targetRow.charIndex, targetRow.row.data.length)
        targetRow.row.width = 0
        this._updateRowCells(targetRow.row)
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
        targetRow.row.data.splice(targetRow.charIndex, deleteCount)
        this._updateRowCells(targetRow.row)
        if (targetRow.row.width) targetRow.rowIndex++
        this._data.splice(targetRow.rowIndex, this._data.length)
        return this._update(targetRow.accLength - 1)
      } else {
        return this.remove()
      }
    }
  }

  replace(index: number, char: ITextChar, option?: ITextMatrixReplaceOption): this {
    const oldChar = this._chars[index]
    if (oldChar.char !== char.char) {
      if (oldChar.width === char.width) {
        this._chars[index] = this._getTextMatrixRowCells([char])[0]
        const flush = option?.flush ?? true
        if (!flush) {
          this._updated = true
          return this
        }
        if (this._updated) this._update(0)
        else {
          const targetRow = this.findTargetRow(index)
          if (targetRow) {
            this._chars[index].row = targetRow.rowIndex
            this._chars[index].col = targetRow.accWidth - char.width
            targetRow.row.data[targetRow.charIndex] = this._chars[index]
          } else throw new Error("未找到字符")
        }
      } else {
        return this.remove(index, { flush: false }).append(char, {
          at: index,
          flush: option?.flush,
        })
      }
    }
    return this
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
      char.row = this._data.length - 1
      char.col = row.width
      row.data.push(char)
      row.width += char.width
    }
    return this
  }

  private _updateRowCells(row: ITextMatrixRow) {
    const rowIndex = this._data.indexOf(row)
    let acc = 0
    for (let item of row.data) {
      item.col = acc
      item.row = rowIndex
      acc += item.width
    }
    row.width = acc
  }

  private _getTextMatrixRowCells(chars: ITextChar[]): ITextMatrixRowCell[] {
    return chars.map((i) => ({ ...i, row: 0, col: 0 }))
  }
}
