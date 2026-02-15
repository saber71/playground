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

export function isRect(arg: any): arg is IRect {
  return typeof arg?.getStartPosition === "function" && typeof arg?.getEndPosition === "function"
}

export function isCursorPosition(arg: any): arg is CursorPosition {
  return typeof arg?.row === "number" && typeof arg?.col === "number"
}

export function equal(arg1: CursorPosition | IRect, arg2: CursorPosition | IRect): boolean {
  if (isRect(arg1)) {
    if (isRect(arg2)) {
      return (
        equal(arg1.getStartPosition(), arg2.getStartPosition()) &&
        equal(arg1.getEndPosition(), arg2.getEndPosition())
      )
    }
    return false
  } else if (isCursorPosition(arg1)) {
    if (isCursorPosition(arg2)) {
      return arg1.row === arg2.row && arg1.col === arg2.col
    }
    return false
  }
  return false
}
