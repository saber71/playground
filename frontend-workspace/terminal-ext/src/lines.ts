import type { IScreenBufferProvider } from "./buffer.interface.ts"
import type { ILineOption, ITerminalLines } from "./lines.interface.ts"

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
