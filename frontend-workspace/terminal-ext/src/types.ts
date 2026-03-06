import type { IDisposable as XTermDisposable } from "@xterm/xterm"

export interface CursorPosition {
  row: number
  col: number
}

export interface TerminalDimension {
  rows: number
  cols: number
}

export type IDisposable = XTermDisposable

export type StopListener = (() => void) & IDisposable
