import { clamp, type IDisposable } from "@saber71/shared"
import type { IRect } from "./capabilities.interface.ts"
import { isRect } from "./capabilities.ts"
import type { CursorPosition } from "./types.ts"

export function assertValidCursorPosition(...args: CursorPosition[]) {
  for (let arg of args) {
    if (arg.col <= 0 || arg.row <= 0) throw new Error("Invalid cursor position")
  }
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

export function clampPos(
  value: Readonly<CursorPosition>,
  min: Readonly<CursorPosition>,
  max: Readonly<CursorPosition>,
): CursorPosition {
  return { row: clamp(value.row, min.row, max.row), col: clamp(value.col, min.col, max.col) }
}

export function posAdd(pos1: CursorPosition, pos2: CursorPosition): CursorPosition {
  return { row: pos1.row + pos2.row, col: pos1.col + pos2.col }
}

export function disposable<T extends () => any>(arg: T): T & IDisposable {
  ;(arg as any).dispose = () => arg()
  return arg as any
}
