export interface CursorPosition {
  row: number
  col: number
}

export interface TerminalDimension {
  rows: number
  cols: number
}

export type StopListener = () => void
