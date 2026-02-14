import type { IRect } from "./capabilities.interface.ts"
import type { CursorPosition } from "./types.ts"

export function assertValidCursorPosition(...args: CursorPosition[]) {
  for (let arg of args) {
    if (arg.col <= 0 || arg.row <= 0) throw new Error("Invalid cursor position")
  }
}

export function createRect(start: CursorPosition, end: CursorPosition): IRect {
  return {
    getCols(): number {
      return end.col - start.col + 1
    },
    getRows(): number {
      return end.row - start.row + 1
    },
    getStartPosition(): Readonly<CursorPosition> {
      return start
    },
    getEndPosition(): Readonly<CursorPosition> {
      return end
    },
  }
}
