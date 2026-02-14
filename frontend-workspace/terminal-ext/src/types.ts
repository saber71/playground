export interface CursorPosition {
  row: number
  col: number
}

export interface TerminalDimension {
  rows: number
  cols: number
}

export type StopListener = () => void

export function assertValidCursorPosition(...args: CursorPosition[]) {
  for (let arg of args) {
    if (arg.col <= 0 || arg.row <= 0) throw new Error("Invalid cursor position")
  }
}
