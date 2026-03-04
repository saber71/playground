import type { IScreenBufferProvider } from "./buffer"
import type { IRect } from "./capabilities.interface.ts"
import type { ILineMode, ILineOption, ITerminalLines } from "./lines.interface.ts"
import type { CursorPosition } from "./types.ts"

const charMap = {
  // left right top bottom
  "1100": ["─", "━", "═"],
  "1000": ["╴", "╸", "═"],
  "0100": ["╶", "╺", "═"],
  "0011": ["│", "┃", "║"],
  "0010": ["╵", "╹", "║"],
  "0001": ["╷", "╻", "║"],
  "1010": ["┘", "┛", "╝"],
  "1001": ["┐", "┓", "╗"],
  "1011": ["┤", "┫", "╣"],
  "0110": ["└", "┗", "╚"],
  "0101": ["┌", "┏", "╔"],
  "0111": ["├", "┣", "╠"],
  "1110": ["┴", "┻", "╩"],
  "1101": ["┬", "┳", "╦"],
  "1111": ["┼", "╋", "╬"],
}

export class TerminalLines implements ITerminalLines {
  constructor(private readonly _bufferProvider: IScreenBufferProvider) {}

  writeRect(rect: IRect, option?: ILineMode): this {
    const leftTop = rect.getStartPosition()
    const rightBottom = rect.getEndPosition()
    const lefBottom: CursorPosition = { row: rightBottom.row, col: leftTop.col }
    const rightTop: CursorPosition = { row: leftTop.row, col: rightBottom.col }
    this.write({ ...leftTop, right: true, bottom: true, mode: option?.mode })
    this.write({ ...rightTop, left: true, bottom: true, mode: option?.mode })
    this.write({ ...rightBottom, left: true, top: true, mode: option?.mode })
    this.write({ ...lefBottom, right: true, top: true, mode: option?.mode })
    for (let i = leftTop.col + 1; i < rightTop.col; i++) {
      this.write({ row: leftTop.row, col: i, left: true, right: true, mode: option?.mode })
    }
    for (let i = lefBottom.col + 1; i < rightBottom.col; i++) {
      this.write({ row: lefBottom.row, col: i, left: true, right: true, mode: option?.mode })
    }
    for (let i = leftTop.row + 1; i < lefBottom.row; i++) {
      this.write({ row: i, col: leftTop.col, top: true, bottom: true, mode: option?.mode })
    }
    for (let i = rightTop.row + 1; i < rightBottom.row; i++) {
      this.write({ row: i, col: rightTop.col, top: true, bottom: true, mode: option?.mode })
    }
    return this
  }

  write(option: ILineOption) {
    const buffer = this._bufferProvider.getScreenBuffer()
    const cell = buffer.getCell(option.row, option.col)
    const value = cell.getValue()
    let charOption = findCharOption().split("")
    if (option.left) charOption[0] = "1"
    if (option.right) charOption[1] = "1"
    if (option.top) charOption[2] = "1"
    if (option.bottom) charOption[3] = "1"
    const key: keyof typeof charMap = charOption.join("") as any
    if (!(key in charMap)) throw new Error("Invalid line option")
    let index = 0
    if (option.mode === "heavy") index = 1
    else if (option.mode === "double") index = 2
    cell.setValue(charMap[key][index])
    return this

    function findCharOption() {
      for (let key in charMap) {
        const chars = (charMap as any)[key]
        for (let char of chars) {
          if (char === value) {
            return key
          }
        }
      }
      return "0000"
    }
  }
}
